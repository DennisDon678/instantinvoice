"use client";

import React, { useState } from "react";
import {
    ArrowLeft,
    Camera,
    Pencil,
    Store,
    MapPin,
    Mail,
    Phone
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveBusinessDetails } from "@/lib/db";

function Onboarding() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        email: "",
        phone: "",
        logo: null
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await saveBusinessDetails(formData);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error saving business details:", error);
            alert("Failed to save business details. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center px-6 py-6">
                <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-900" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900 ml-2">
                    Business Registration
                </h1>
            </div>

            <div className="flex flex-col px-6 pb-10 flex-1">
                <p className="text-gray-500 text-sm mb-8">
                    Tell us a bit about your business to personalize your invoices.
                </p>

                {/* Logo Upload */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                            <Camera className="w-8 h-8 text-gray-300" />
                        </div>
                        <button className="absolute bottom-3 right-0 bg-[#11dcdc] p-1.5 rounded-full text-white hover:bg-[#0fbdbd] transition-colors shadow-sm">
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <span className="text-gray-500 text-xs font-medium">Upload Logo</span>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                    {/* Business Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-900">
                            Business Name
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Store className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="e.g. Acme Design Studio"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Business Address */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-900">
                            Business Address
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Street, City, Zip Code"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Business Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-900">
                            Business Email
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                placeholder="contact@business.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-900">
                            Phone Number
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Phone className="w-5 h-5" />
                            </div>
                            <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 mb-4">
                    <button
                        className="w-full bg-primary hover:bg-[#ffe033] text-black font-bold py-4 rounded-xl shadow-lg shadow-orange-100 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSave}
                        disabled={isSaving || !formData.name || !formData.email}
                    >
                        {isSaving ? 'Saving...' : 'Continue'}
                    </button>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        <div className="w-6 h-1.5 rounded-full bg-primary"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Onboarding;