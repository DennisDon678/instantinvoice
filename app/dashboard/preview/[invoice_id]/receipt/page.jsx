"use client";

import React from "react";
import {
    X,
    Check,
    Share2,
    Printer,
    CreditCard
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PaymentReceipt() {
    const params = useParams();
    const invoiceId = params.invoice_id;

    // Mock receipt data
    const receipt = {
        amount: 450.00,
        date: "Oct 24, 2023",
        receiptNumber: "#INV-0023",
        recipient: {
            name: "Jane Doe Designs",
            type: "Freelance Services",
            initial: "J"
        },
        payment: {
            method: "Bank Transfer",
            last4: "4242"
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 bg-white border-b border-gray-100 flex-shrink-0">
                <Link href="/dashboard" className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-6 h-6 text-gray-900" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Payment Receipt</h1>
                <div className="w-6"></div>
            </div>

            <div className="flex-1 overflow-y-auto pb-40">
                <div className="px-6 py-8">
                    {/* Receipt Card */}
                    <div className="bg-white rounded-t-3xl shadow-lg overflow-hidden relative">
                        {/* Gradient accent bar */}
                        <div className="h-2 bg-gradient-to-r from-teal-400 via-primary to-teal-400"></div>

                        <div className="p-8 pb-12">
                            {/* Success Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center shadow-lg">
                                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                                </div>
                            </div>

                            {/* Payment Confirmed */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Payment Confirmed
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Transaction successful
                                </p>
                            </div>

                            {/* Amount */}
                            <div className="text-center mb-8">
                                <p className="text-5xl font-bold text-gray-900">
                                    ${receipt.amount.toFixed(2)}
                                </p>
                            </div>

                            {/* Dashed separator */}
                            <div className="border-t-2 border-dashed border-gray-200 my-8"></div>

                            {/* Date and Receipt Number */}
                            <div className="flex justify-between mb-8">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                        Date
                                    </p>
                                    <p className="text-base font-bold text-gray-900">
                                        {receipt.date}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                        Receipt #
                                    </p>
                                    <p className="text-base font-bold text-gray-900">
                                        {receipt.receiptNumber}
                                    </p>
                                </div>
                            </div>

                            {/* To Section */}
                            <div className="mb-8">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                                    To
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold text-lg flex-shrink-0">
                                        {receipt.recipient.initial}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-base">
                                            {receipt.recipient.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {receipt.recipient.type}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                                    Payment Method
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="font-bold text-gray-900">
                                        {receipt.payment.method} •••• {receipt.payment.last4}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Scalloped bottom edge */}
                        <div className="relative h-6 bg-white">
                            <div className="absolute inset-0 flex">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 h-6 bg-[#f8f8f5] rounded-t-full"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Message */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            A confirmation email has been sent to your registered email address.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 bg-white px-6 py-6 space-y-3">
                <button className="w-full py-4 px-6 bg-primary rounded-2xl font-bold text-base text-black hover:bg-[#ffe033] transition-colors flex items-center justify-center gap-3 shadow-lg">
                    <Share2 className="w-5 h-5" />
                    Share Receipt
                </button>
                <button className="w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-2xl font-bold text-base text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
                    <Printer className="w-5 h-5" />
                    Print Receipt
                </button>
            </div>
        </div>
    );
}
