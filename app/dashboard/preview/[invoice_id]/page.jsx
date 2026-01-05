"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
    ArrowLeft,
    Download,
    Share2,
    Printer,
    CheckCircle2,
    Landmark
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getInvoice, updateInvoice } from "@/lib/db";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export default function InvoicePreview() {
    const params = useParams();
    const router = useRouter();
    const invoiceId = params.invoice_id;
    const invoiceRef = useRef(null);

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [exporting, setExporting] = useState(false);

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

    useEffect(() => {
        loadInvoice();
    }, [loadInvoice]);

    const handleMarkAsPaid = async () => {
        try {
            setUpdating(true);
            await updateInvoice(invoice.id, { status: 'paid' });
            setInvoice({ ...invoice, status: 'paid' });
        } catch (error) {
            console.error("Error updating invoice:", error);
            alert("Failed to update invoice status");
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-green-50 text-green-700';
            case 'pending':
                return 'bg-yellow-50 text-yellow-700';
            case 'canceled':
            case 'cancelled':
                return 'bg-red-50 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleDownloadPNG = async () => {
        if (!invoiceRef.current || !invoice) return;
        setExporting(true);
        try {
            const dataUrl = await toPng(invoiceRef.current, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                style: {
                    borderRadius: '0'
                }
            });
            const link = document.createElement('a');
            link.download = `invoice-${invoice.invoiceNumber || 'preview'}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Error generating PNG:', err);
            alert('Failed to generate PNG');
        } finally {
            setExporting(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current || !invoice) return;
        setExporting(true);
        try {
            const dataUrl = await toPng(invoiceRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                style: {
                    borderRadius: '0'
                }
            });
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice-${invoice.invoiceNumber || 'preview'}.pdf`);
        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('Failed to generate PDF');
        } finally {
            setExporting(false);
        }
    };

    const handleShare = async () => {
        if (!invoiceRef.current || !invoice) return;
        setExporting(true);
        try {
            const dataUrl = await toPng(invoiceRef.current, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                style: {
                    borderRadius: '0'
                }
            });

            // Convert dataUrl to File
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], `invoice-${invoice.invoiceNumber || 'preview'}.png`, { type: 'image/png' });

            const shareData = {
                title: `Invoice ${invoice.invoiceNumber || ''}`,
                text: `Invoice from ${invoice.businessDetails?.name || 'InstantInvoice'}`,
                files: [file],
            };

            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback: Share link if file sharing is not supported
                const linkShareData = {
                    title: `Invoice ${invoice.invoiceNumber || ''}`,
                    text: `Invoice from ${invoice.businessDetails?.name || 'InstantInvoice'}`,
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
            // Non-blocking error if share canceled
            if (err.name !== 'AbortError') {
                alert("Failed to share invoice");
            }
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full w-full bg-[#f8f8f5] items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading invoice...</p>
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

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 shrink-0">
                <Link href="/dashboard" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Invoice Preview</h1>
                <Link href={`/dashboard/preview/${invoiceId}/receipt`} className="text-sm font-bold text-yellow-500 hover:text-[#d4d400]">
                    Receipt
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto pb-32 pb-safe">
                <div className="px-6 py-6">
                    {/* Invoice Card */}
                    <div ref={invoiceRef} className="bg-white rounded-3xl shadow-sm overflow-hidden">
                        {/* Yellow accent bar */}
                        <div className="h-2 bg-primary"></div>

                        <div className="p-6 space-y-6">
                            {/* Header with Logo and Status */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    {invoice.businessDetails?.logo ? (
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm bg-white border-2 border-gray-100 relative">
                                            <Image
                                                src={invoice.businessDetails.logo}
                                                alt="Logo"
                                                fill
                                                className="object-contain"
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                            {invoice.businessDetails?.name?.substring(0, 2).toUpperCase() || "IN"}
                                        </div>
                                    )}
                                </div>
                                <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(invoice.status)}`}>
                                    {invoice.status || 'PENDING'}
                                </div>
                            </div>

                            {/* Company Info */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {invoice.businessDetails?.name || "Your Business"}
                                </h2>
                                {invoice.businessDetails?.address && (
                                    <div className="text-sm text-gray-500 space-y-0.5">
                                        <p>{invoice.businessDetails.address}</p>
                                        <p>{invoice.businessDetails.city} {invoice.businessDetails.zipCode}</p>
                                        {invoice.businessDetails.country && <p>{invoice.businessDetails.country}</p>}
                                    </div>
                                )}
                                {invoice.businessDetails?.email && (
                                    <p className="text-sm text-gray-500 mt-1">{invoice.businessDetails.email}</p>
                                )}
                            </div>

                            {/* Invoice Number */}
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Invoice No.</p>
                                <p className="text-xl font-bold text-gray-900">{invoice.invoiceNumber}</p>
                            </div>

                            {/* Bill To and Details */}
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div>
                                    <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-wide mb-3">
                                        Bill To
                                    </h3>
                                    <p className="font-bold text-gray-900 mb-1">{invoice.clientName}</p>
                                    {invoice.clientEmail && (
                                        <p className="text-sm text-gray-500">{invoice.clientEmail}</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-wide mb-3">
                                        Details
                                    </h3>
                                    <div className="space-y-1">
                                        {invoice.issueDate && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Issued:</span>
                                                <span className="font-medium text-gray-900">{formatDate(invoice.issueDate)}</span>
                                            </div>
                                        )}
                                        {invoice.dueDate && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Due:</span>
                                                <span className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bank Details */}
                            {invoice.businessDetails?.bankName && (
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <Landmark className="w-4 h-4" />
                                        Bank Details
                                    </h3>
                                    <div className="space-y-2 text-sm">
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
                                                <span className="text-gray-500">Account Name:</span>
                                                <span className="font-medium text-gray-900">{invoice.businessDetails.accountHolderName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Line Items */}
                            <div className="pt-4">
                                <div className="col-span-12 grid grid-cols-12 gap-2 pb-3 border-b border-gray-200">
                                    <div className="col-span-5">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Description
                                        </h3>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            QTY
                                        </h3>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Unit
                                        </h3>
                                    </div>
                                    <div className="col-span-3 text-right">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Amount
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-4 py-4">
                                    {invoice.items?.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-2 py-1">
                                            <div className="col-span-5">
                                                <p className="font-bold text-gray-900 text-sm">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {item.qty}
                                                </p>
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {invoice.currencySymbol || '₦'}{item.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                            <div className="col-span-3 text-right">
                                                <p className="font-bold text-gray-900 text-sm">
                                                    {invoice.currencySymbol || '₦'}{(item.qty * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                        {invoice.currencySymbol || '₦'}{invoice.subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">VAT (7.5%)</span>
                                    <span className="font-medium text-gray-900">
                                        {invoice.currencySymbol || '₦'}{invoice.tax?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="text-lg font-bold text-gray-900">Total Due</span>
                                    <span className="text-2xl font-bold text-yellow-500">
                                        {invoice.currencySymbol || '₦'}{invoice.total?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* Notes */}
                            {invoice.notes && (
                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                        Notes & Terms
                                    </h3>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                        {invoice.notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Branding Footer */}
                        <div className="mt-8 mb-4 text-center">
                            <p className="text-[10px] text-gray-400 font-medium">
                                InstantInvoice by <a href="https://instantcodes.ng/" target="_blank" rel="noopener noreferrer" className=" text-yellow-500 font-bold hover:underline">instantCodes</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 pb-safe shadow-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownloadPNG}
                            disabled={exporting}
                            className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            <Download className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            onClick={handleShare}
                            className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                            <Share2 className="w-5 h-5 text-gray-700" />
                        </button>
                        {/* <button
                            onClick={handleDownloadPDF}
                            disabled={exporting}
                            className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            <Printer className="w-5 h-5 text-gray-700" />
                        </button> */}
                    </div>
                    {invoice.status?.toLowerCase() !== 'paid' && (
                        <button
                            onClick={handleMarkAsPaid}
                            disabled={updating}
                            className="flex-1 ml-4 py-3 px-6 bg-primary rounded-xl font-bold text-sm text-black hover:bg-[#ffe033] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            {updating ? 'Updating...' : 'Mark as Paid'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
