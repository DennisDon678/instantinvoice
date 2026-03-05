"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Plus, Building2, Check, ExternalLink } from "lucide-react";
import {
    getAllBusinesses,
    getActiveBusinessId,
    setActiveBusinessId,
    saveBusiness,
    getBusiness
} from "@/lib/db";

export default function BusinessSwitcher({ onBusinessChange }) {
    const [businesses, setBusinesses] = useState([]);
    const [activeId, setActiveId] = useState("");
    const [activeBusiness, setActiveBusiness] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBusinessName, setNewBusinessName] = useState("");

    const loadBusinesses = async () => {
        const all = await getAllBusinesses();
        const currentId = getActiveBusinessId();
        setBusinesses(all);
        setActiveId(currentId);

        const current = all.find(b => b.id === currentId) || all[0];
        setActiveBusiness(current);
        if (current && current.id !== currentId) {
            setActiveBusinessId(current.id);
            setActiveId(current.id);
        }
    };

    useEffect(() => {
        const init = async () => {
            await loadBusinesses();
        };
        init();
    }, []);

    const handleSwitch = (id) => {
        setActiveBusinessId(id);
        setActiveId(id);
        setIsOpen(false);
        if (onBusinessChange) onBusinessChange(id);
        window.location.reload(); // Simplest way to refresh all data
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newBusinessName.trim()) return;

        const newBiz = {
            name: newBusinessName,
            createdAt: new Date().toISOString()
        };
        const id = await saveBusiness(newBiz);
        setShowCreateModal(false);
        setNewBusinessName("");
        await loadBusinesses();
        handleSwitch(id);
    };

    if (!activeBusiness) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all shadow-sm"
            >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary-dark" />
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 leading-none mb-1">Business</p>
                    <p className="text-sm font-bold text-gray-900 leading-none truncate max-w-[120px]">
                        {activeBusiness.name}
                    </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 mb-1">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Switch Business</p>
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                            {businesses.map((biz) => (
                                <button
                                    key={biz.id}
                                    onClick={() => handleSwitch(biz.id)}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${biz.id === activeId ? 'bg-primary/20' : 'bg-gray-100'}`}>
                                            <Building2 className={`w-4 h-4 ${biz.id === activeId ? 'text-primary-dark' : 'text-gray-400'}`} />
                                        </div>
                                        <span className={`text-sm font-medium ${biz.id === activeId ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                                            {biz.name}
                                        </span>
                                    </div>
                                    {biz.id === activeId && <Check className="w-4 h-4 text-primary-dark" />}
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 mt-2 pt-2 px-2">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setShowCreateModal(true);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-primary-dark hover:bg-primary/5 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create New Business
                            </button>
                        </div>
                    </div>
                </>
            )}

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-6 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Plus className="w-6 h-6 text-primary" />
                            New Business
                        </h3>
                        <form onSubmit={handleCreate}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business Name</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newBusinessName}
                                        onChange={(e) => setNewBusinessName(e.target.value)}
                                        placeholder="e.g. Acme Corp"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold text-sm text-gray-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newBusinessName.trim()}
                                        className="flex-1 py-3.5 px-4 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:grayscale rounded-2xl font-bold text-sm text-black transition-all shadow-lg shadow-primary/20"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
