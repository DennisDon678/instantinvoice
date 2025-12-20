"use client";

import React, { useState } from "react";
import {
    Search,
    Plus,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    DollarSign,
    TrendingUp
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("All");
    const router = useRouter();

    const financialCards = [
        {
            title: "Paid",
            amount: "$8,750",
            count: "12 invoices",
            icon: CheckCircle2,
            iconBg: "bg-green-50",
            iconColor: "text-green-600"
        },
        {
            title: "Pending",
            amount: "$3,200",
            count: "4 invoices",
            icon: Clock,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        {
            title: "Cancelled",
            amount: "$500",
            count: "2 invoices",
            icon: XCircle,
            iconBg: "bg-red-50",
            iconColor: "text-red-600"
        },
        {
            title: "Total Revenue",
            amount: "$12,450",
            count: "+12% from last month",
            icon: DollarSign,
            iconBg: "bg-primary/10",
            iconColor: "text-gray-900",
            highlight: true
        }
    ];

    const invoices = [
        {
            id: "001",
            client: "Acme Corp",
            amount: "1,200",
            status: "PAID",
            due: "Due Oct 24",
            logo: "A",
            bgColor: "bg-slate-900"
        },
        {
            id: "002",
            client: "John Doe Designs",
            amount: "450",
            status: "PENDING",
            due: "Due Nov 01",
            logo: "JD",
            bgColor: "bg-gray-400",
            textColor: "text-white"
        },
        {
            id: "003",
            client: "TechStart Inc",
            amount: "2,500",
            status: "OVERDUE",
            due: "Due Yesterday",
            logo: "T",
            bgColor: "bg-teal-600"
        },
        {
            id: "004",
            client: "Global Media",
            amount: "3,100",
            status: "PENDING",
            due: "Due Oct 15",
            logo: "G",
            bgColor: "bg-blue-400"
        }
    ];

    const handleNewInvoice = () => {
        router.push('/dashboard/new');
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 pt-6 pb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                        <FileText className="w-6 h-6 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold text-gray-900">InstantInvoice</span>
                </div>
               <Link href="/dashboard/settings">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-orange-700 font-bold text-sm shadow-sm">
                    JD
                </div>
               </Link>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
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
                        <button className="text-sm font-semibold text-gray-500 hover:text-gray-700">View All</button>
                    </div>

                    <div className="space-y-3 pb-4">
                        {invoices.map((inv) => (
                            <div
                                key={inv.id}
                                className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${inv.bgColor} rounded-full flex items-center justify-center ${inv.textColor || 'text-white'} font-bold text-base shadow-sm`}>
                                        {inv.logo}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm mb-0.5">{inv.client}</h4>
                                        <span className="text-xs text-gray-400 font-medium">Inv #{inv.id} • {inv.due}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <span className="font-bold text-gray-900 text-base">${inv.amount}</span>
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide 
                    ${inv.status === 'PAID' ? 'bg-primary/30 text-gray-900' : ''}
                    ${inv.status === 'PENDING' ? 'bg-blue-50 text-blue-700' : ''}
                    ${inv.status === 'OVERDUE' ? 'bg-red-50 text-red-600' : ''}
                  `}>
                                        {inv.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAB */}
            <div className="absolute bottom-8 right-6 z-10">
                <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95" onClick={() => handleNewInvoice()}>
                    <Plus className="w-8 h-8 text-black" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}
