"use client";

import React, { useState } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function DefaultNotes() {
    const [notes, setNotes] = useState("Thank you for your business!");

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f8f5] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 shrink-0">
                <Link href="/dashboard/settings" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Default Notes</h1>
                <button className="px-5 py-2 bg-primary rounded-full font-bold text-sm text-black hover:bg-[#ffe033] transition-colors">
                    Save
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-6">
                <div className="px-6 py-6 space-y-6">
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                        <p className="text-sm text-blue-900">
                            <span className="font-bold">Tip:</span> These notes will automatically appear on all new invoices. You can edit them for individual invoices.
                        </p>
                    </div>

                    {/* Notes Editor */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Invoice Notes & Terms
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={8}
                            placeholder="Enter default notes or payment terms..."
                            className="w-full bg-gray-50 rounded-xl p-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        />
                        <div className="flex justify-between items-center mt-3">
                            <p className="text-xs text-gray-400">
                                {notes.length} characters
                            </p>
                            <button
                                onClick={() => setNotes("")}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Common Templates */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Common Templates</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setNotes("Thank you for your business! Payment is due within 30 days.")}
                                className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <p className="text-sm font-medium text-gray-900 mb-1">Standard Payment Terms</p>
                                <p className="text-xs text-gray-500">Thank you for your business! Payment is due within 30 days.</p>
                            </button>

                            <button
                                onClick={() => setNotes("Please make payment via bank transfer to the account details provided above. Late payments may incur additional fees.")}
                                className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <p className="text-sm font-medium text-gray-900 mb-1">Bank Transfer Instructions</p>
                                <p className="text-xs text-gray-500">Please make payment via bank transfer...</p>
                            </button>

                            <button
                                onClick={() => setNotes("We appreciate your business! For any questions regarding this invoice, please contact us at your convenience.")}
                                className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <p className="text-sm font-medium text-gray-900 mb-1">Friendly Closing</p>
                                <p className="text-xs text-gray-500">We appreciate your business! For any questions...</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
