"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function LogoManagement() {
    const [hasLogo, setHasLogo] = useState(false);

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 shrink-0">
                <Link href="/dashboard/settings" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Logo Management</h1>
                <button className="px-5 py-2 bg-primary rounded-full font-bold text-sm text-black hover:bg-[#ffe033] transition-colors">
                    Save
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-6">
                <div className="px-6 py-6 space-y-6">
                    {/* Logo Upload */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-6">
                            Company Logo
                        </h3>

                        <div className="flex flex-col items-center">
                            {hasLogo ? (
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-4xl">AC</span>
                                    </div>
                                    <button
                                        onClick={() => setHasLogo(false)}
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

                            <button
                                onClick={() => setHasLogo(true)}
                                className="w-full py-4 px-6 bg-primary rounded-xl font-bold text-black hover:bg-[#ffe033] transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Upload className="w-5 h-5" />
                                Upload Logo
                            </button>

                            <p className="text-xs text-gray-400 mt-4 text-center">
                                Recommended: Square image, at least 512x512px
                                <br />
                                Formats: PNG, JPG, SVG
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
                                <span>Maximum file size: 5MB</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
