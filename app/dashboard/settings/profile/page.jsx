"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Building2, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBusinessDetails, saveBusinessDetails } from "@/lib/db";

export default function BusinessProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        country: ""
    });

    useEffect(() => {
        loadBusinessData();
    }, []);

    const loadBusinessData = async () => {
        try {
            const business = await getBusinessDetails();
            if (business) {
                setFormData({
                    name: business.name || "",
                    type: business.type || "",
                    email: business.email || "",
                    phone: business.phone || "",
                    address: business.address || "",
                    city: business.city || "",
                    zipCode: business.zipCode || "",
                    country: business.country || ""
                });
            }
        } catch (error) {
            console.error("Error loading business data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // Basic validation
        if (!formData.name.trim()) {
            alert("Business name is required");
            return;
        }
        if (!formData.email.trim()) {
            alert("Email is required");
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
            console.error("Error saving business profile:", error);
            alert("Failed to save business profile. Please try again.");
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
                <h1 className="text-lg font-bold text-gray-900">Business Profile</h1>
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
                    {/* Business Name */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block">
                            Business Name *
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="e.g. Acme Corp"
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
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            placeholder="e.g. Freelance Design, Consulting"
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
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="business@email.com *"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
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
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="Street Address"
                                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                placeholder="City"
                                className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <input
                                type="text"
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                placeholder="Zip Code"
                                className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            placeholder="Country"
                            className="w-full bg-gray-50 rounded-xl py-4 px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                        <p className="text-sm text-blue-900">
                            <span className="font-bold">Note:</span> This information will appear on your invoices and receipts.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
