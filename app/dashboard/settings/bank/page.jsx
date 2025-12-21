"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Building2, CreditCard, Hash, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBusinessDetails, saveBusinessDetails } from "@/lib/db";

export default function BankDetails() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        accountHolderName: "",
        swiftCode: "",
        iban: ""
    });

    useEffect(() => {
        loadBankData();
    }, []);

    const loadBankData = async () => {
        try {
            const business = await getBusinessDetails();
            if (business) {
                setFormData({
                    bankName: business.bankName || "",
                    accountNumber: business.accountNumber || "",
                    routingNumber: business.routingNumber || "",
                    accountHolderName: business.accountHolderName || "",
                    swiftCode: business.swiftCode || "",
                    iban: business.iban || ""
                });
            }
        } catch (error) {
            console.error("Error loading bank data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // Validation - bank name and account number are required
        if (!formData.bankName.trim()) {
            alert("Bank name is required");
            return;
        }
        if (!formData.accountNumber.trim()) {
            alert("Account number is required");
            return;
        }

        try {
            setSaving(true);
            const currentBusiness = await getBusinessDetails();

            await saveBusinessDetails({
                ...currentBusiness,
                ...formData
            });

            router.push("/dashboard/settings");
        } catch (error) {
            console.error("Error saving bank details:", error);
            alert("Failed to save bank details. Please try again.");
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
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 shrink-0">
                <Link href="/dashboard/settings" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Bank Details</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2 bg-primary rounded-full font-bold text-sm text-black hover:bg-[#ffe033] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-6">
                <div className="px-6 py-6 space-y-6">
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                        <p className="text-sm text-blue-900">
                            <span className="font-bold">Note:</span> Bank details will appear on your invoices for client payments.
                        </p>
                    </div>

                    {/* Bank Name */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block">
                            Bank Name *
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.bankName}
                                onChange={(e) => handleInputChange('bankName', e.target.value)}
                                placeholder="e.g. Chase Bank, Bank of America"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                            Account Details
                        </h3>

                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.accountNumber}
                                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                placeholder="Account Number *"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.routingNumber}
                                onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                                placeholder="Routing Number (Optional)"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.accountHolderName}
                                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                                placeholder="Account Holder Name"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                            International Details (Optional)
                        </h3>

                        <input
                            type="text"
                            value={formData.swiftCode}
                            onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                            placeholder="SWIFT/BIC Code"
                            className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />

                        <input
                            type="text"
                            value={formData.iban}
                            onChange={(e) => handleInputChange('iban', e.target.value)}
                            placeholder="IBAN"
                            className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    {/* Help Text */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-600">
                            <span className="font-bold">Required fields:</span> Bank Name and Account Number
                            <br />
                            <span className="font-bold">Optional:</span> Routing Number, Account Holder Name, SWIFT/BIC, IBAN
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
