"use client";

import React from "react";
import { ArrowLeft, Building2, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function BusinessProfile() {
    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 shrink-0">
                <Link href="/dashboard/settings" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Business Profile</h1>
                <button className="px-5 py-2 bg-primary rounded-full font-bold text-sm text-black hover:bg-[#ffe033] transition-colors">
                    Save
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-6">
                <div className="px-6 py-6 space-y-6">
                    {/* Business Name */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block">
                            Business Name
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                defaultValue="Acme Corp"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                    </div>

                    {/* Business Type */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block">
                            Business Type
                        </label>
                        <input
                            type="text"
                            defaultValue="Freelance Design"
                            className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                            Contact Information
                        </h3>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="business@email.com"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                            Business Address
                        </h3>

                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Street Address"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="City"
                                className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <input
                                type="text"
                                placeholder="Zip Code"
                                className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Country"
                            className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
