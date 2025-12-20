"use client";

import React from "react";
import { ArrowLeft, Building2, CreditCard, Hash } from "lucide-react";
import Link from "next/link";

export default function BankDetails() {
    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 shrink-0">
                <Link href="/dashboard/settings" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Bank Details</h1>
                <button className="px-5 py-2 bg-primary rounded-full font-bold text-sm text-black hover:bg-[#ffe033] transition-colors">
                    Save
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
                            Bank Name
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="e.g. Chase Bank"
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
                                placeholder="Account Number"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Routing Number"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Account Holder Name"
                            className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    {/* Additional Info */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                            Additional Information (Optional)
                        </h3>

                        <input
                            type="text"
                            placeholder="SWIFT/BIC Code"
                            className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />

                        <input
                            type="text"
                            placeholder="IBAN"
                            className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
