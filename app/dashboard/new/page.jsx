"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Camera,
    Plus,
    Trash2,
    Landmark
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBusinessDetails, getSetting, saveInvoice } from "@/lib/db";

export default function NewInvoice() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [notes, setNotes] = useState("");
    const [taxRate, setTaxRate] = useState(7.5); // Default 7.5% VAT
    const [lineItems, setLineItems] = useState([
        { id: Date.now(), description: "", qty: 1, price: 0 }
    ]);

    // Prepopulated data
    const [businessDetails, setBusinessDetails] = useState(null);
    const [currency, setCurrency] = useState("NGN");
    const [currencySymbol, setCurrencySymbol] = useState("₦");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [business, savedCurrency, defaultNotes] = await Promise.all([
                getBusinessDetails(),
                getSetting('currency'),
                getSetting('defaultNotes')
            ]);

            setBusinessDetails(business);
            setCurrency(savedCurrency || 'NGN');
            setNotes(defaultNotes || "Thank you for your business!");

            // Set currency symbol
            const currencyMap = {
                'NGN': '₦', 'GHS': '₵', 'USD': '$', 'GBP': '£', 'EUR': '€',
                'ZAR': 'R', 'KES': 'KSh', 'EGP': 'E£'
            };
            setCurrencySymbol(currencyMap[savedCurrency] || '₦');

            // Generate invoice number
            const invNumber = generateInvoiceNumber();
            setInvoiceNumber(invNumber);

            // Set today's date
            const today = new Date().toISOString().split('T')[0];
            setIssueDate(today);

        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateInvoiceNumber = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
        return `INV-${year}${month}${day}-${time}`;
    };

    const addLineItem = () => {
        setLineItems([
            ...lineItems,
            { id: Date.now(), description: "", qty: 1, price: 0 }
        ]);
    };

    const removeLineItem = (id) => {
        if (lineItems.length > 1) {
            setLineItems(lineItems.filter(item => item.id !== id));
        }
    };

    const updateLineItem = (id, field, value) => {
        setLineItems(lineItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateSubtotal = () => {
        return lineItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * (taxRate / 100);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handleSaveInvoice = async () => {
        // Validation
        if (!clientName.trim()) {
            alert("Please enter client name");
            return;
        }

        const hasValidItems = lineItems.some(item => item.description.trim() && item.qty > 0 && item.price > 0);
        if (!hasValidItems) {
            alert("Please add at least one valid line item");
            return;
        }

        try {
            setSaving(true);

            const invoice = {
                id: Date.now(),
                invoiceNumber,
                issueDate,
                dueDate,
                clientName,
                clientEmail,
                items: lineItems.filter(item => item.description.trim()),
                subtotal: calculateSubtotal(),
                tax: calculateTax(),
                taxRate,
                total: calculateTotal(),
                currency,
                currencySymbol,
                notes,
                status: 'pending',
                businessDetails,
                createdAt: new Date().toISOString()
            };

            await saveInvoice(invoice);
            router.push(`/dashboard/preview/${invoice.id}`);
        } catch (error) {
            console.error("Error saving invoice:", error);
            alert("Failed to save invoice. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full w-full bg-[#f8f8f5] items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-6 bg-white border-b border-gray-100 shrink-0">
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Cancel
                </Link>
                <h1 className="text-lg font-bold text-gray-900">New Invoice</h1>
                <div className="w-16"></div>
            </div>

            <div className="flex-1 overflow-y-auto pb-32">
                <div className="px-6 py-6 space-y-6">
                    {/* Business Details */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                            From (Your Business)
                        </h2>
                        <div className="flex items-start gap-4 mb-4">
                            {businessDetails?.logo ? (
                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white border-2 border-gray-100">
                                    <img src={businessDetails.logo} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                            ) : (
                                <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
                                    <Camera className="w-6 h-6 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">{businessDetails?.name || "Your Business"}</p>
                                <p className="text-xs text-gray-500 mt-1">{businessDetails?.email}</p>
                                <p className="text-xs text-gray-500">{businessDetails?.phone}</p>
                            </div>
                        </div>
                        {businessDetails?.address && (
                            <div className="text-xs text-gray-500 space-y-0.5">
                                <p>{businessDetails.address}</p>
                                <p>{businessDetails.city} {businessDetails.zipCode}</p>
                                <p>{businessDetails.country}</p>
                            </div>
                        )}
                    </div>

                    {/* Client Details */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                            Bill To (Client)
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Client Name *</label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="Enter client or company name"
                                    className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
                                <input
                                    type="email"
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                    placeholder="client@company.com"
                                    className="w-full text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                            Invoice Details
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Invoice Number</label>
                                <input
                                    type="text"
                                    value={invoiceNumber}
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                    className="w-full text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Issue Date</label>
                                    <input
                                        type="date"
                                        value={issueDate}
                                        onChange={(e) => setIssueDate(e.target.value)}
                                        className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Due Date</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Currency</label>
                                <div className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-4 py-3">
                                    {currency} - {currencySymbol}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details */}
                    {businessDetails?.bankName && (
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Landmark className="w-4 h-4" />
                                Bank Details
                            </h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Bank:</span>
                                    <span className="font-medium text-gray-900">{businessDetails.bankName}</span>
                                </div>
                                {businessDetails.accountNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Account:</span>
                                        <span className="font-medium text-gray-900">{businessDetails.accountNumber}</span>
                                    </div>
                                )}
                                {businessDetails.accountHolderName && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Account Name:</span>
                                        <span className="font-medium text-gray-900">{businessDetails.accountHolderName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Line Items */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                Line Items
                            </h2>
                            <span className="text-xs font-bold text-primary">{lineItems.length} item{lineItems.length !== 1 ? 's' : ''}</span>
                        </div>

                        <div className="space-y-3">
                            {lineItems.map((item, index) => (
                                <div key={item.id} className="border-l-4 border-primary bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                            placeholder="Item description"
                                            className="flex-1 text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none"
                                        />
                                        {lineItems.length > 1 && (
                                            <button
                                                onClick={() => removeLineItem(item.id)}
                                                className="p-1 hover:bg-red-50 rounded-lg transition-colors ml-2"
                                            >
                                                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">QTY</label>
                                            <input
                                                type="number"
                                                value={item.qty}
                                                onChange={(e) => updateLineItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                                                className="w-full text-sm font-medium text-gray-900 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">PRICE</label>
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => updateLineItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                className="w-full text-sm font-medium text-gray-900 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">TOTAL</label>
                                            <div className="text-sm font-bold text-gray-900 bg-white rounded-lg px-3 py-2">
                                                {currencySymbol}{(item.qty * item.price).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addLineItem}
                            className="w-full mt-4 border-2 border-dashed border-gray-200 rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Line Item
                        </button>
                    </div>

                    {/* Tax Rate */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                            Tax Settings
                        </h2>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">VAT/Tax Rate (%)</label>
                            <input
                                type="number"
                                value={taxRate}
                                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <p className="text-xs text-gray-400 mt-2">Enter 0 for no tax. Default is 7.5% (Nigeria VAT)</p>
                        </div>
                    </div>

                    {/* Notes & Terms */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                            Notes & Terms
                        </h2>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Thank you for your business..."
                            rows={3}
                            className="w-full text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Summary */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 shadow-2xl">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium text-gray-900">{currencySymbol}{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">VAT ({taxRate}%)</span>
                        <span className="font-medium text-gray-900">{currencySymbol}{calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg pt-2 border-t border-gray-100">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-gray-900">{currencySymbol}{calculateTotal().toFixed(2)}</span>
                    </div>
                </div>
                <button
                    onClick={handleSaveInvoice}
                    disabled={saving}
                    className="w-full py-3 px-4 bg-primary rounded-xl font-bold text-sm text-black hover:bg-[#ffe033] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Saving...' : 'Save Invoice'}
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
            </div>
        </div>
    );
}
