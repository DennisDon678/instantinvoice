"use client";

import React from "react";
import {
    ArrowLeft,
    Download,
    Share2,
    Printer,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function InvoicePreview() {
    const params = useParams();
    const invoiceId = params.invoice_id;

    // Mock invoice data - in real app, fetch based on invoiceId
    const invoice = {
        number: "#INV-2023-001",
        status: "PENDING",
        company: {
            name: "OpenInvoice Inc.",
            address: "42 Design Street, Creative City",
            logo: "OI"
        },
        client: {
            name: "Acme Corp",
            address: "100 Enterprise Way",
            city: "Tech Park, CA 94000"
        },
        dates: {
            issued: "Oct 10, 2023",
            due: "Oct 24, 2023"
        },
        items: [
            {
                description: "Web Design Services",
                subtitle: "UI/UX Design for Homepage",
                qty: 1,
                amount: 800.00
            },
            {
                description: "SEO Optimization",
                subtitle: "Initial Audit & Setup",
                qty: 4,
                amount: 400.00
            }
        ],
        subtotal: 1200.00,
        tax: 120.00,
        total: 1320.00
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
                <Link href="/dashboard" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Invoice Preview</h1>
                <Link href={`/dashboard/edit/${invoiceId}`} className="text-sm font-bold text-primary hover:text-[#d4d400]">
                    Edit
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto pb-32">
                <div className="px-6 py-6">
                    {/* Invoice Card */}
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                        {/* Yellow accent bar */}
                        <div className="h-2 bg-primary"></div>

                        <div className="p-6 space-y-6">
                            {/* Header with Logo and Status */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        {invoice.company.logo}
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium">
                                        LOREMIE IPSUM
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${invoice.status === 'PENDING' ? 'bg-gray-100 text-gray-700' :
                                        invoice.status === 'PAID' ? 'bg-green-50 text-green-700' :
                                            'bg-red-50 text-red-700'
                                    }`}>
                                    {invoice.status}
                                </div>
                            </div>

                            {/* Company Info */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {invoice.company.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {invoice.company.address}
                                </p>
                            </div>

                            {/* Invoice Number */}
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Invoice No.</p>
                                <p className="text-xl font-bold text-gray-900">{invoice.number}</p>
                            </div>

                            {/* Bill To and Details */}
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div>
                                    <h3 className="text-xs font-bold text-primary uppercase tracking-wide mb-3">
                                        Bill To
                                    </h3>
                                    <p className="font-bold text-gray-900 mb-1">{invoice.client.name}</p>
                                    <p className="text-sm text-gray-500">{invoice.client.address}</p>
                                    <p className="text-sm text-gray-500">{invoice.client.city}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-primary uppercase tracking-wide mb-3">
                                        Details
                                    </h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Issued:</span>
                                            <span className="font-medium text-gray-900">{invoice.dates.issued}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Due:</span>
                                            <span className="font-medium text-gray-900">{invoice.dates.due}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="pt-4">
                                <div className="grid grid-cols-12 gap-2 pb-3 border-b border-gray-200">
                                    <div className="col-span-7">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Description
                                        </h3>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            QTY
                                        </h3>
                                    </div>
                                    <div className="col-span-3 text-right">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Amount
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-4 py-4">
                                    {invoice.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-2">
                                            <div className="col-span-7">
                                                <p className="font-bold text-gray-900 text-sm mb-0.5">
                                                    {item.description}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.subtitle}
                                                </p>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {item.qty}
                                                </p>
                                            </div>
                                            <div className="col-span-3 text-right">
                                                <p className="font-bold text-gray-900 text-sm">
                                                    ${item.amount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="pt-4 border-t border-gray-200 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        ${invoice.subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tax (10%)</span>
                                    <span className="font-medium text-gray-900">
                                        ${invoice.tax.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="text-lg font-bold text-gray-900">Total Due</span>
                                    <span className="text-2xl font-bold text-primary">
                                        ${invoice.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <button className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Download className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Share2 className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Printer className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="flex-1 ml-4 py-3 px-6 bg-primary rounded-xl font-bold text-sm text-black hover:bg-[#ffe033] transition-colors flex items-center justify-center gap-2 shadow-lg">
                        <CheckCircle2 className="w-5 h-5" />
                        Mark as Paid
                    </button>
                </div>
            </div>
        </div>
    );
}
