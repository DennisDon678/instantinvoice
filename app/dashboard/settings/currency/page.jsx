"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSetting, saveSetting } from "@/lib/db";

export default function CurrencySettings() {
    const router = useRouter();
    const [selectedCurrency, setSelectedCurrency] = useState("NGN");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // Popular African currencies + USD and GBP
    const currencies = [
        // Nigerian Naira (Default)
        { code: "NGN", name: "Nigerian Naira", symbol: "₦", country: "Nigeria" },

        // Other African Currencies
        { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", country: "Ghana" },
        { code: "ZAR", name: "South African Rand", symbol: "R", country: "South Africa" },
        { code: "KES", name: "Kenyan Shilling", symbol: "KSh", country: "Kenya" },
        { code: "EGP", name: "Egyptian Pound", symbol: "E£", country: "Egypt" },
        { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", country: "Tanzania" },
        { code: "UGX", name: "Ugandan Shilling", symbol: "USh", country: "Uganda" },
        { code: "XOF", name: "West African CFA Franc", symbol: "CFA", country: "West Africa" },
        { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA", country: "Central Africa" },
        { code: "MAD", name: "Moroccan Dirham", symbol: "DH", country: "Morocco" },
        { code: "ETB", name: "Ethiopian Birr", symbol: "Br", country: "Ethiopia" },
        { code: "RWF", name: "Rwandan Franc", symbol: "FRw", country: "Rwanda" },

        // International Currencies
        { code: "USD", name: "United States Dollar", symbol: "$", country: "United States" },
        { code: "GBP", name: "British Pound Sterling", symbol: "£", country: "United Kingdom" },
        { code: "EUR", name: "Euro", symbol: "€", country: "European Union" },
    ];

    useEffect(() => {
        loadCurrency();
    }, []);

    const loadCurrency = async () => {
        try {
            const savedCurrency = await getSetting('currency');
            if (savedCurrency) {
                setSelectedCurrency(savedCurrency);
            }
        } catch (error) {
            console.error("Error loading currency:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCurrency = async (currencyCode) => {
        try {
            setSelectedCurrency(currencyCode);
            await saveSetting('currency', currencyCode);

            // Navigate back after a short delay to show selection
            setTimeout(() => {
                router.push("/dashboard/settings");
            }, 300);
        } catch (error) {
            console.error("Error saving currency:", error);
            alert("Failed to save currency. Please try again.");
        }
    };

    const filteredCurrencies = currencies.filter(
        (currency) =>
            currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            currency.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <h1 className="text-lg font-bold text-gray-900">Currency</h1>
                <div className="w-16"></div>
            </div>

            <div className="flex-1 overflow-y-auto pb-6">
                <div className="px-6 py-6 space-y-4">
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                        <p className="text-sm text-blue-900">
                            <span className="font-bold">Default:</span> Nigerian Naira (₦). Select your preferred currency for invoices.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search currency or country..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
                        />
                    </div>

                    {/* Currency List */}
                    {filteredCurrencies.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                            <p className="text-gray-500">No currencies found</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            {filteredCurrencies.map((currency, index) => (
                                <button
                                    key={currency.code}
                                    onClick={() => handleSelectCurrency(currency.code)}
                                    className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${index !== filteredCurrencies.length - 1 ? 'border-b border-gray-100' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-700 text-lg">
                                            {currency.symbol}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">{currency.code}</p>
                                            <p className="text-sm text-gray-500">{currency.name}</p>
                                            <p className="text-xs text-gray-400">{currency.country}</p>
                                        </div>
                                    </div>
                                    {selectedCurrency === currency.code && (
                                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                                            <Check className="w-4 h-4 text-black" strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
