"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, Check } from "lucide-react";
import Link from "next/link";

export default function CurrencySettings() {
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [searchQuery, setSearchQuery] = useState("");

    const currencies = [
        { code: "USD", name: "United States Dollar", symbol: "$" },
        { code: "EUR", name: "Euro", symbol: "€" },
        { code: "GBP", name: "British Pound", symbol: "£" },
        { code: "JPY", name: "Japanese Yen", symbol: "¥" },
        { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
        { code: "AUD", name: "Australian Dollar", symbol: "A$" },
        { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
        { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
        { code: "INR", name: "Indian Rupee", symbol: "₹" },
        { code: "MXN", name: "Mexican Peso", symbol: "$" }
    ];

    const filteredCurrencies = currencies.filter(
        (currency) =>
            currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            currency.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 shrink-0">
                <Link href="/dashboard/settings" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Currency</h1>
                <div className="w-16"></div>
            </div>

            <div className="flex-1 overflow-y-auto pb-6">
                <div className="px-6 py-6 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search currency..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
                        />
                    </div>

                    {/* Currency List */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {filteredCurrencies.map((currency, index) => (
                            <button
                                key={currency.code}
                                onClick={() => setSelectedCurrency(currency.code)}
                                className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${index !== filteredCurrencies.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-700">
                                        {currency.symbol}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900">{currency.code}</p>
                                        <p className="text-sm text-gray-500">{currency.name}</p>
                                    </div>
                                </div>
                                {selectedCurrency === currency.code && (
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-black" strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
