"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    X,
    Check,
    Share2,
    Printer,
    Landmark,
    Download
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getInvoice } from "@/lib/db";
import { toPng } from "html-to-image";

export default function PaymentReceipt() {
    const params = useParams();
    const router = useRouter();
    const invoiceId = params.invoice_id;

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const receiptRef = useRef(null);

    const loadInvoice = useCallback(async () => {
        try {
            const invoiceData = await getInvoice(parseInt(invoiceId));
            if (invoiceData) {
                setInvoice(invoiceData);
            } else {
                alert("Invoice not found");
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Error loading invoice:", error);
            alert("Failed to load invoice");
        } finally {
            setLoading(false);
        }
    }, [invoiceId, router]);

    const handleShare = async () => {
        if (!receiptRef.current || !invoice) return;
        setExporting(true);
        try {
            const dataUrl = await toPng(receiptRef.current, {
                cacheBust: true,
                backgroundColor: '#f8f8f5',
                style: {
                    borderRadius: '0'
                }
            });

            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], `receipt-${invoice.invoiceNumber || 'preview'}.png`, { type: 'image/png' });

            const shareData = {
                title: `Receipt ${invoice.invoiceNumber || ''}`,
                text: `Receipt from ${invoice.businessDetails?.name || 'InstantInvoice'}`,
                files: [file],
            };

            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                const linkShareData = {
                    title: `Receipt ${invoice.invoiceNumber || ''}`,
                    text: `Receipt from ${invoice.businessDetails?.name || 'InstantInvoice'}`,
                    url: window.location.href,
                };

                if (navigator.share) {
                    await navigator.share(linkShareData);
                } else {
                    await navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                }
            }
        } catch (err) {
            console.error("Error sharing:", err);
            if (err.name !== 'AbortError') {
                alert("Failed to share receipt");
            }
        } finally {
            setExporting(false);
        }
    };

    const handleDownload = async () => {
        if (!receiptRef.current || !invoice) return;
        setExporting(true);
        try {
            const dataUrl = await toPng(receiptRef.current, {
                cacheBust: true,
                backgroundColor: '#f8f8f5',
                style: {
                    borderRadius: '0'
                }
            });
            const link = document.createElement('a');
            link.download = `receipt-${invoice.invoiceNumber || 'preview'}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Error generating PNG:', err);
            alert('Failed to generate PNG');
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        loadInvoice();
    }, [loadInvoice]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getInitials = (name) => {
        if (!name) return 'IN';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full w-full bg-[#f8f8f5] items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading receipt...</p>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex flex-col h-full w-full bg-[#f8f8f5] items-center justify-center">
                <p className="text-gray-500">Invoice not found</p>
                <Link href="/dashboard" className="mt-4 text-primary font-bold">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    const isPaid = invoice.status?.toLowerCase() === 'paid';

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 bg-white border-b border-gray-100 shrink-0">
                <Link href={`/dashboard/preview/${invoiceId}`} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-6 h-6 text-gray-900" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">
                    {isPaid ? 'Payment Receipt' : 'Invoice Receipt'}
                </h1>
                <div className="w-6"></div>
            </div>

            <div className="flex-1 overflow-y-auto pb-40">
                <div className="px-6 py-8">
                    {/* Receipt Card */}
                    <div ref={receiptRef} className="bg-white rounded-t-3xl shadow-lg overflow-hidden relative">
                        {/* Gradient accent bar */}
                        <div className={`h-2 ${isPaid ? 'bg-linear-to-r from-teal-400 via-primary to-teal-400' : 'bg-linear-to-r from-yellow-400 via-primary to-yellow-400'}`}></div>

                        <div className="p-8 pb-12">
                            {/* Success/Status Icon */}
                            <div className="flex justify-center mb-6">
                                <div className={`w-20 h-20 ${isPaid ? 'bg-teal-600' : 'bg-yellow-500'} rounded-full flex items-center justify-center shadow-lg`}>
                                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                                </div>
                            </div>

                            {/* Status Message */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {isPaid ? 'Payment Confirmed' : 'Invoice Created'}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    {isPaid ? 'Transaction successful' : 'Awaiting payment'}
                                </p>
                            </div>

                            {/* Amount */}
                            <div className="text-center mb-8">
                                <p className="text-5xl font-bold text-gray-900">
                                    {invoice.currencySymbol || '₦'}{invoice.total?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                        {formatDate(invoice.issueDate || invoice.createdAt)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                        Invoice #
                                    </p>
                                    <p className="text-base font-bold text-gray-900">
                                        {invoice.invoiceNumber}
                                    </p>
                                </div>
                            </div>

                            {/* From Section */}
                            <div className="mb-8">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                                    From
                                </p>
                                <div className="flex items-center gap-4">
                                    {invoice.businessDetails?.logo ? (
                                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-white border-2 border-gray-100">
                                            <img src={invoice.businessDetails.logo} alt="Logo" className="w-full h-full object-contain" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold text-lg shrink-0">
                                            {getInitials(invoice.businessDetails?.name)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-gray-900 text-base">
                                            {invoice.businessDetails?.name || 'Your Business'}
                                        </p>
                                        {invoice.businessDetails?.email && (
                                            <p className="text-sm text-gray-500">
                                                {invoice.businessDetails.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* To Section */}
                            <div className="mb-8">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                                    To
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
                                        {getInitials(invoice.clientName)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-base">
                                            {invoice.clientName}
                                        </p>
                                        {invoice.clientEmail && (
                                            <p className="text-sm text-gray-500">
                                                {invoice.clientEmail}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Line Items Summary */}
                            <div className="mb-8">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                                    Items
                                </p>
                                <div className="space-y-2">
                                    {invoice.items?.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.description} × {item.qty}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {invoice.currencySymbol}{(item.qty * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        {invoice.currencySymbol}{invoice.subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">VAT (7.5%)</span>
                                    <span className="font-medium text-gray-900">
                                        {invoice.currencySymbol}{invoice.tax?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">
                                        {invoice.currencySymbol}{invoice.total?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* Bank Details */}
                            {invoice.businessDetails?.bankName && (
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <Landmark className="w-4 h-4" />
                                        Payment Details
                                    </p>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Bank:</span>
                                            <span className="font-medium text-gray-900">{invoice.businessDetails.bankName}</span>
                                        </div>
                                        {invoice.businessDetails.accountNumber && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Account:</span>
                                                <span className="font-medium text-gray-900">{invoice.businessDetails.accountNumber}</span>
                                            </div>
                                        )}
                                        {invoice.businessDetails.accountHolderName && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Name:</span>
                                                <span className="font-medium text-gray-900">{invoice.businessDetails.accountHolderName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>



                        {/* Confirmation Message */}
                        <div className="text-center px-6">
                            <p className="text-sm text-gray-500">
                                {isPaid
                                    ? 'Thank you for your payment. This receipt has been generated for your records.'
                                    : 'This invoice is awaiting payment. Please use the bank details above to complete the transaction.'}
                            </p>
                        </div>

                        {/* Branding Footer */}
                        <div className="my-3 text-center opacity-60">
                            <p className="text-[10px] text-gray-400 font-medium">
                                InstantInvoice by <a href="https://instantcodes.ng/" target="_blank" rel="noopener noreferrer" className="text-yellow-500 font-bold hover:underline">instantCodes</a>
                            </p>
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
            </div>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 bg-white px-6 py-6 space-y-3">
                <button
                    onClick={handleShare}
                    disabled={exporting}
                    className="w-full py-4 px-6 bg-primary rounded-2xl font-bold text-base text-black hover:bg-[#ffe033] transition-colors flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                >
                    <Share2 className={`w-5 h-5 ${exporting ? 'animate-pulse' : ''}`} />
                    {exporting ? 'Preparing...' : 'Share Receipt'}
                </button>
                <button
                    onClick={handleDownload}
                    disabled={exporting}
                    className="w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-2xl font-bold text-base text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <Download className={`w-5 h-5 ${exporting ? 'animate-pulse' : ''}`} />
                    {exporting ? 'Downloading...' : 'Download Receipt'}
                </button>
            </div>
        </div>
    );
}
