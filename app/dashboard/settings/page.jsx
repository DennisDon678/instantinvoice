"use client";

import React, { useState } from "react";
import {
    ArrowLeft,
    Building2,
    Image as ImageIcon,
    Landmark,
    DollarSign,
    FileText,
    Moon,
    ChevronRight,
    Pencil
} from "lucide-react";
import Link from "next/link";

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);

    const businessInfo = {
        name: "Acme Corp",
        type: "Freelance Design",
        avatar: "AC"
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
                <Link href="/dashboard" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Settings</h1>
                <Link href="/dashboard" className="px-5 py-2 bg-primary rounded-full font-bold text-sm text-black hover:bg-[#ffe033] transition-colors">
                    Done
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto pb-6">
                <div className="px-6 py-6 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                    {businessInfo.avatar}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-[#ffe033] transition-colors">
                                    <Pencil className="w-4 h-4 text-black" />
                                </button>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    {businessInfo.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {businessInfo.type}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Business Identity Section */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-2">
                            Business Identity
                        </h3>
                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                            <Link href="/dashboard/settings/profile" className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors border-b border-gray-100">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="flex-1 font-semibold text-gray-900">Business Profile</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>

                            <Link href="/dashboard/settings/logo" className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors border-b border-gray-100">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <ImageIcon className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="flex-1 font-semibold text-gray-900">Logo Management</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>

                            <Link href="/dashboard/settings/bank" className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Landmark className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="flex-1 font-semibold text-gray-900">Bank Details</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>
                        </div>
                    </div>

                    {/* Invoice Defaults Section */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-2">
                            Invoice Defaults
                        </h3>
                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                            <Link href="/dashboard/settings/currency" className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors border-b border-gray-100">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <DollarSign className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="flex-1 font-semibold text-gray-900">Currency</span>
                                <span className="text-sm text-gray-400 font-medium">USD</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>

                            <Link href="/dashboard/settings/notes" className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="flex-1 font-semibold text-gray-900">Default Notes</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>
                        </div>
                    </div>

                    {/* System Section */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-2">
                            System
                        </h3>
                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                            <div className="flex items-center gap-4 p-5">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Moon className="w-6 h-6 text-gray-700" />
                                </div>
                                <span className="flex-1 font-semibold text-gray-900">Dark Mode</span>
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-gray-200'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-8 pb-4">
                        <p className="text-sm text-gray-400 mb-1">OpenInvoice v1.0.2</p>
                        <p className="text-xs text-gray-400">© 2024 OpenInvoice Inc.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
