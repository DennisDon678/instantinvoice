"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    ArrowLeft,
    Building2,
    Image as ImageIcon,
    Landmark,
    DollarSign,
    FileText,
    Moon,
    ChevronRight,
    Pencil,
    Database,
    Trash2,
    TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { getBusinessDetails, getSetting, getAllInvoices, deleteInvoicesByYear, calculateTotalStorageUsage } from "@/lib/db";

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [businessDetails, setBusinessDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState('NGN');
    const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0, percentage: 0 });
    const [availableYears, setAvailableYears] = useState([]);
    const [yearToDelete, setYearToDelete] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const loadBusinessData = useCallback(async () => {
        try {
            const business = await getBusinessDetails();
            setBusinessDetails(business);

            // Load currency setting
            const savedCurrency = await getSetting('currency');
            setCurrency(savedCurrency || 'NGN'); // Default to Naira

            // Fetch available years from invoices
            const invoices = await getAllInvoices();
            const years = [...new Set(invoices.map(inv => {
                const dateStr = inv.issueDate || inv.createdAt;
                if (!dateStr) return null;
                const date = new Date(dateStr);
                return isNaN(date.getTime()) ? null : date.getFullYear().toString();
            }))].filter(y => y !== null).sort((a, b) => b - a);
            setAvailableYears(years);

            // Set initial year to delete if not set
            if (years.length > 0) {
                setYearToDelete(prev => prev || years[0]);
            }

            // Get storage estimation
            let used = 0;
            let total = 0;

            // Manual calculation for used space (reliable on mobile)
            used = await calculateTotalStorageUsage();

            // Total quota from browser if available
            if (navigator.storage && navigator.storage.estimate) {
                const estimate = await navigator.storage.estimate();
                total = estimate.quota || 1024 * 1024 * 50; // Fallback to 50MB if quota missing
            } else {
                total = 1024 * 1024 * 50; // Fallback to 50MB
            }

            setStorageUsage({
                used,
                total,
                percentage: total > 0 ? (used / total) * 100 : 0
            });
        } catch (error) {
            console.error("Error loading business data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBusinessData();
    }, [loadBusinessData]);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDeleteYear = async () => {
        if (!yearToDelete) return;

        try {
            setIsDeleting(true);
            const count = await deleteInvoicesByYear(yearToDelete);
            alert(`Successfully deleted ${count} invoices from ${yearToDelete}`);
            setShowDeleteConfirm(false);
            loadBusinessData(); // Refresh years and storage info
        } catch (error) {
            console.error("Error deleting invoices:", error);
            alert("Failed to delete invoices. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "AC";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
            <div className="flex justify-between items-center px-6 py-6 bg-white border-b border-gray-100 shrink-0">
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
                            <div className="relative shrink-0">
                                {businessDetails?.logo ? (
                                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-md bg-white border-2 border-gray-100">
                                        <img
                                            src={businessDetails.logo}
                                            alt="Business Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-linear-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center text-orange-700 font-bold text-2xl shadow-sm">
                                        {getInitials(businessDetails?.name)}
                                    </div>
                                )}
                                <Link href="/dashboard/settings/logo">
                                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-[#ffe033] transition-colors">
                                        <Pencil className="w-4 h-4 text-black" />
                                    </button>
                                </Link>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    {businessDetails?.name || "Your Business"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {businessDetails?.email || "Add business details"}
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
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                                    <Building2 className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="flex-1 font-semibold text-gray-900">Business Profile</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>

                            <Link href="/dashboard/settings/logo" className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors border-b border-gray-100">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                                    <ImageIcon className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="flex-1 font-semibold text-gray-900">Logo Management</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>

                            <Link href="/dashboard/settings/bank" className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
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
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                                    <DollarSign className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="flex-1 font-semibold text-gray-900">Currency</span>
                                <span className="text-sm text-gray-400 font-medium">{currency}</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>

                            <Link href="/dashboard/settings/notes" className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                                    <FileText className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="flex-1 font-semibold text-gray-900">Default Notes</span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </Link>
                        </div>
                    </div>

                    {/* Data Management Section */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-2">
                            Data Management
                        </h3>
                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden divide-y divide-gray-100">
                            {/* Storage Info */}
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <Database className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-gray-900">Storage Usage</span>
                                            <span className="text-xs font-bold text-gray-500">{formatBytes(storageUsage.used)} / {formatBytes(storageUsage.total)}</span>
                                        </div>
                                        <p className="text-xs text-gray-400">Total space used by your business data</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="bg-blue-600 h-full transition-all duration-500 ease-out"
                                        style={{ width: `${Math.max(storageUsage.percentage, 1)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">IndexedDB Capacity</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{storageUsage.percentage.toFixed(4)}% utilized</span>
                                </div>
                            </div>

                            {/* Annual Cleanup */}
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <Trash2 className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">Annual Cleanup</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">Quickly remove all data for a specific year</p>
                                    </div>
                                </div>

                                {availableYears.length > 0 ? (
                                    <div className="flex gap-3">
                                        <select
                                            value={yearToDelete}
                                            onChange={(e) => setYearToDelete(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        >
                                            {availableYears.map(year => (
                                                <option key={year} value={year}>{year} Invoices</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-sm active:scale-95"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                                        <p className="text-xs font-medium text-gray-500 italic">No invoice history found to cleanup</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-8 pb-4">
                        <p className="text-sm text-gray-400 mb-1">InstantInvoice v1.0.0</p>
                        <p className="text-xs text-gray-400">© 2025 instantCodes</p>
                    </div>
                </div>
            </div>

            {/* Custom Modal for Deletion Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                    />
                    <div className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <TriangleAlert className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete {yearToDelete} Invoices?</h3>
                        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
                            This action is permanent and will remove every invoice record created in <span className="font-bold text-gray-900">{yearToDelete}</span>. This cannot be undone.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={handleDeleteYear}
                                disabled={isDeleting}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>Yes, Delete All</>
                                )}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="w-full py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
