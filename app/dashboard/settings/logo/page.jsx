"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBusinessDetails, saveBusinessDetails } from "@/lib/db";

export default function LogoManagement() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoData, setLogoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadBusinessData();
    }, []);

    const loadBusinessData = async () => {
        try {
            const business = await getBusinessDetails();
            if (business?.logo) {
                setLogoPreview(business.logo);
                setLogoData(business.logo);
            }
        } catch (err) {
            console.error("Error loading business data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            setError("Please upload a PNG, JPG, or SVG image");
            return;
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError("File size must be less than 5MB");
            return;
        }

        setError(null);

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setLogoPreview(base64String);
            setLogoData(base64String);
        };
        reader.onerror = () => {
            setError("Failed to read file");
        };
        reader.readAsDataURL(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveLogo = () => {
        setLogoPreview(null);
        setLogoData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const currentBusiness = await getBusinessDetails();

            await saveBusinessDetails({
                ...currentBusiness,
                logo: logoData
            });

            router.push("/dashboard/settings");
        } catch (err) {
            console.error("Error saving logo:", err);
            setError("Failed to save logo. Please try again.");
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
                <h1 className="text-lg font-bold text-gray-900">Logo Management</h1>
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
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                            <p className="text-sm text-red-900 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Logo Upload */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-6">
                            Company Logo
                        </h3>

                        <div className="flex flex-col items-center">
                            {logoPreview ? (
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg bg-white border-2 border-gray-100">
                                        <img
                                            src={logoPreview}
                                            alt="Company Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <button
                                        onClick={handleRemoveLogo}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-32 h-32 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
                                    <ImageIcon className="w-12 h-12 text-gray-300" />
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <button
                                onClick={handleUploadClick}
                                className="w-full py-4 px-6 bg-primary rounded-xl font-bold text-black hover:bg-[#ffe033] transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Upload className="w-5 h-5" />
                                {logoPreview ? 'Change Logo' : 'Upload Logo'}
                            </button>

                            <p className="text-xs text-gray-400 mt-4 text-center">
                                Recommended: Square image, at least 512x512px
                                <br />
                                Formats: PNG, JPG, SVG • Max size: 5MB
                            </p>
                        </div>
                    </div>

                    {/* Logo Guidelines */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Logo Guidelines</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Use a square or circular logo for best results</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Ensure good contrast for visibility on invoices</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Transparent backgrounds work best for versatility</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Logo will be displayed on invoices and receipts</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
