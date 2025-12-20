"use client";

import React, { useState } from "react";
import {
    ArrowLeft,
    Camera,
    Search,
    Plus,
    Trash2,
    MoreVertical
} from "lucide-react";
import Link from "next/link";

export default function NewInvoice() {
    const [lineItems, setLineItems] = useState([
        { id: 1, description: "Website Design - Homepage", qty: 1, price: 1200.00 },
        { id: 2, description: "Mobile Responsiveness", qty: 5, price: 80.00 }
    ]);

    const addLineItem = () => {
        setLineItems([
            ...lineItems,
            { id: Date.now(), description: "", qty: 1, price: 0 }
        ]);
    };

    const removeLineItem = (id) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };

    const calculateSubtotal = () => {
        return lineItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.1; // 10% tax
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Cancel
                </Link>
                <h1 className="text-lg font-bold text-gray-900">New Invoice</h1>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-32">
                <div className="px-6 py-6 space-y-6">
                    {/* Business Details */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                            Business Details
                        </h2>
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Camera className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">From</label>
                                    <input
                                        type="text"
                                        defaultValue="Design Studio Ltd."
                                        className="w-full text-sm font-semibold text-gray-900 bg-transparent border-none focus:outline-none p-0"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Street Address"
                                className="w-full text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="w-full text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                <input
                                    type="text"
                                    placeholder="Zip Code"
                                    className="w-full text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Client Details */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                            Client Details
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Bill To</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Select or type client name"
                                        className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>
                            <input
                                type="email"
                                placeholder="client@company.com"
                                className="w-full text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
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
                                    defaultValue="# INV-2023-001"
                                    className="w-full text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Issued</label>
                                    <input
                                        type="date"
                                        defaultValue="2023-12-20"
                                        className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Currency</label>
                                <select className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30">
                                    <option>USD - United States Dollar ($)</option>
                                    <option>EUR - Euro (€)</option>
                                    <option>GBP - British Pound (£)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                Line Items
                            </h2>
                            <span className="text-xs font-bold text-primary">2 items</span>
                        </div>

                        <div className="space-y-3">
                            {lineItems.map((item, index) => (
                                <div key={item.id} className="border-l-4 border-primary bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => {
                                                const newItems = [...lineItems];
                                                newItems[index].description = e.target.value;
                                                setLineItems(newItems);
                                            }}
                                            placeholder="Item description"
                                            className="flex-1 text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none"
                                        />
                                        <button
                                            onClick={() => removeLineItem(item.id)}
                                            className="p-1 hover:bg-red-50 rounded-lg transition-colors ml-2"
                                        >
                                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">QTY</label>
                                            <input
                                                type="number"
                                                value={item.qty}
                                                onChange={(e) => {
                                                    const newItems = [...lineItems];
                                                    newItems[index].qty = parseInt(e.target.value) || 0;
                                                    setLineItems(newItems);
                                                }}
                                                className="w-full text-sm font-medium text-gray-900 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">PRICE</label>
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => {
                                                    const newItems = [...lineItems];
                                                    newItems[index].price = parseFloat(e.target.value) || 0;
                                                    setLineItems(newItems);
                                                }}
                                                className="w-full text-sm font-medium text-gray-900 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">TOTAL</label>
                                            <div className="text-sm font-bold text-gray-900 bg-white rounded-lg px-3 py-2">
                                                ${(item.qty * item.price).toFixed(2)}
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

                    {/* Notes & Terms */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                            Notes & Terms
                        </h2>
                        <textarea
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
                        <span className="font-medium text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax (10%)</span>
                        <span className="font-medium text-gray-900">${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg pt-2 border-t border-gray-100">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 px-4 bg-white border-2 border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Preview
                    </button>
                    <button className="py-3 px-4 bg-primary rounded-xl font-bold text-sm text-black hover:bg-[#ffe033] transition-colors flex items-center justify-center gap-2">
                        Save Invoice
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                </div>
            </div>
        </div>
    );
}
