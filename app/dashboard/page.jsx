"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Search,
    Plus,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    DollarSign,
    TrendingUp,
    Settings
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllInvoices, getBusinessDetails, getSetting } from "@/lib/db";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("All");
    const router = useRouter();
    const [invoices, setInvoices] = useState([]);
    const [businessDetails, setBusinessDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currencySymbol, setCurrencySymbol] = useState("₦");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [availableYears, setAvailableYears] = useState([new Date().getFullYear().toString()]);

    // Pagination state for infinite scroll
    const [visibleCount, setVisibleCount] = useState(10);
    const observerTarget = useRef(null);

    const loadData = useCallback(async () => {
        try {
            const [invoicesData, businessData, savedCurrency] = await Promise.all([
                getAllInvoices(),
                getBusinessDetails(),
                getSetting('currency')
            ]);

            // If business details don't exist, redirect to onboarding
            if (!businessData || !businessData.name) {
                router.push("/onboarding");
                return;
            }

            setInvoices(invoicesData || []);
            setBusinessDetails(businessData);

            // Extract unique years from invoices
            if (invoicesData && invoicesData.length > 0) {
                const years = [...new Set(invoicesData.map(inv => {
                    const dateStr = inv.issueDate || inv.createdAt;
                    if (!dateStr) return null;
                    const date = new Date(dateStr);
                    return isNaN(date.getTime()) ? null : date.getFullYear().toString();
                }))].filter(y => y !== null).sort((a, b) => b - a);

                if (years.length > 0) {
                    setAvailableYears(years);
                    // If current year not in available years, set to most recent year
                    const currentYear = new Date().getFullYear().toString();
                    if (!years.includes(currentYear)) {
                        setSelectedYear(years[0]);
                    }
                }
            }

            // Set currency symbol
            const currencyMap = {
                'NGN': '₦', 'GHS': '₵', 'USD': '$', 'GBP': '£', 'EUR': '€',
                'ZAR': 'R', 'KES': 'KSh', 'EGP': 'E£'
            };
            setCurrencySymbol(currencyMap[savedCurrency] || '₦');
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Filter invoices based on active tab, search query, and selected year
    const filteredInvoices = invoices.filter(inv => {
        const dateStr = inv.issueDate || inv.createdAt;
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const invYear = isNaN(date.getTime()) ? "" : date.getFullYear().toString();
        const matchesYear = invYear === selectedYear;

        const matchesTab = activeTab === "All" ||
            inv.status?.toUpperCase() === activeTab.toUpperCase() ||
            (activeTab === "Canceled" && (inv.status === "CANCELLED" || inv.status === "CANCELED"));

        const matchesSearch = !searchQuery ||
            inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.clientName?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesYear && matchesTab && matchesSearch;
    });

    // Calculate financial statistics
    const calculateFinancials = () => {
        const yearInvoices = invoices.filter(inv => {
            const dateStr = inv.issueDate || inv.createdAt;
            if (!dateStr) return false;
            const date = new Date(dateStr);
            const invYear = isNaN(date.getTime()) ? "" : date.getFullYear().toString();
            return invYear === selectedYear;
        });

        const paid = yearInvoices.filter(inv => inv.status?.toUpperCase() === "PAID");
        const pending = yearInvoices.filter(inv => inv.status?.toUpperCase() === "PENDING");
        const cancelled = yearInvoices.filter(inv => {
            const status = inv.status?.toUpperCase();
            return status === "CANCELLED" || status === "CANCELED";
        });

        const paidTotal = paid.reduce((sum, inv) => sum + (inv.total || 0), 0);
        const pendingTotal = pending.reduce((sum, inv) => sum + (inv.total || 0), 0);
        const cancelledTotal = cancelled.reduce((sum, inv) => sum + (inv.total || 0), 0);
        const totalRevenue = paidTotal;

        return {
            paid: { amount: paidTotal, count: paid.length },
            pending: { amount: pendingTotal, count: pending.length },
            cancelled: { amount: cancelledTotal, count: cancelled.length },
            total: totalRevenue
        };
    };

    const stats = calculateFinancials();

    const financialCards = [
        {
            title: "Paid",
            amount: `${currencySymbol}${stats.paid.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            count: `${stats.paid.count} invoice${stats.paid.count !== 1 ? 's' : ''}`,
            icon: CheckCircle2,
            iconBg: "bg-green-50",
            iconColor: "text-green-600"
        },
        {
            title: "Pending",
            amount: `${currencySymbol}${stats.pending.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            count: `${stats.pending.count} invoice${stats.pending.count !== 1 ? 's' : ''}`,
            icon: Clock,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        {
            title: "Cancelled",
            amount: `${currencySymbol}${stats.cancelled.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            count: `${stats.cancelled.count} invoice${stats.cancelled.count !== 1 ? 's' : ''}`,
            icon: XCircle,
            iconBg: "bg-red-50",
            iconColor: "text-red-600"
        },
        {
            title: "Total Revenue",
            amount: `${currencySymbol}${stats.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            count: "From paid invoices",
            icon: DollarSign,
            iconBg: "bg-primary/10",
            iconColor: "text-gray-900",
            highlight: true
        }
    ];

    // Reset pagination when year, tab, or search changes
    useEffect(() => {
        setVisibleCount(10);
    }, [selectedYear, activeTab, searchQuery]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && filteredInvoices.length > visibleCount) {
                    setVisibleCount(prev => prev + 10);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [filteredInvoices.length, visibleCount]);

    // Get initials from client name
    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Generate random color for avatar
    const getAvatarColor = (index) => {
        const colors = [
            "bg-slate-900",
            "bg-gray-400",
            "bg-teal-600",
            "bg-blue-400",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500"
        ];
        return colors[index % colors.length];
    };

    // Format date
    const formatDueDate = (dateString) => {
        if (!dateString) return "No due date";
        const date = new Date(dateString);
        return `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    const handleNewInvoice = () => {
        router.push('/dashboard/new');
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-6 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                        <FileText className="w-6 h-6 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                        {"InstantInvoice"}
                    </span>
                </div>
                <Link href="/dashboard/settings">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-orange-700 font-bold text-sm shadow-sm">
                        <Settings />
                    </div>
                </Link>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading dashboard...</p>
                    </div>
                </div>
            ) : (

                <div className="flex-1 overflow-y-auto pb-24 pb-safe">
                    {/* Year Selection and Summary Header */}
                    <div className="px-6 py-4 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Performance Summary</h3>
                        <div className="relative inline-block">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm appearance-none pr-10"
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <TrendingUp className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary Cards - Horizontal Scroll */}
                    <div className="px-6 mb-6">
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                            {financialCards.map((card, index) => {
                                const Icon = card.icon;
                                return (
                                    <div
                                        key={index}
                                        className="min-w-[280px] bg-white rounded-3xl p-6 shadow-sm snap-start"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                                                <Icon className={`w-5 h-5 ${card.iconColor}`} strokeWidth={2} />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                            <h2 className="text-3xl font-bold text-gray-900">{card.amount}</h2>
                                            <p className={`text-xs font-medium ${card.highlight ? 'text-green-600 flex items-center gap-1' : 'text-gray-400'}`}>
                                                {card.highlight && <TrendingUp className="w-3 h-3" />}
                                                {card.count}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="px-6">
                        {/* Search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search client or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {["All", "Pending", "Paid", "Canceled"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${activeTab === tab
                                        ? "bg-primary text-black shadow-md"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Recent Invoices List */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Recent Invoices</h3>
                            <span className="text-sm font-semibold text-gray-500">{filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}</span>
                        </div>

                        {filteredInvoices.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No invoices found</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {searchQuery ? "Try a different search" : "Create your first invoice to get started"}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 pb-4">
                                {filteredInvoices.slice(0, visibleCount).map((inv, index) => (
                                    <div
                                        key={inv.id}
                                        onClick={() => router.push(`/dashboard/preview/${inv.id}`)}
                                        className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm`}>
                                                {getInitials(inv.clientName)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm mb-0.5">
                                                    {inv.clientName || "Unknown Client"}
                                                </h4>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {inv.invoiceNumber} • {formatDueDate(inv.dueDate)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className="font-bold text-gray-900 text-base">
                                                {inv.currencySymbol || currencySymbol}{(inv.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide 
                                            ${inv.status === 'PAID' ? 'bg-primary/30 text-gray-900' : ''}
                                            ${inv.status === 'PENDING' ? 'bg-blue-50 text-blue-700' : ''}
                                            ${inv.status === 'OVERDUE' ? 'bg-red-50 text-red-600' : ''}
                                            ${(inv.status === 'CANCELLED' || inv.status === 'CANCELED') ? 'bg-gray-100 text-gray-600' : ''}
                                        `}>
                                                {inv.status || 'DRAFT'}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Scroll Sentinel */}
                                {filteredInvoices.length > visibleCount && (
                                    <div ref={observerTarget} className="flex justify-center py-6">
                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FAB */}
            <div className="absolute bottom-8 right-6 z-10 mb-safe">
                <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95" onClick={() => handleNewInvoice()}>
                    <Plus className="w-8 h-8 text-black" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}
