"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import StockChart from "@/components/admin/StockChart";
import { getStokTimeSeries } from "@/lib/supabase";
import { Warehouse, Package, Loader2 } from "lucide-react";
import GudangNavbar from "@/components/gudang/GudangNavbar";

export default function GudangPage() {
    const [stokData, setStokData] = useState<Array<{ nama_barang: string; data: { tanggal: string; pengambilan: number }[] }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await getStokTimeSeries();
                setStokData(data);
            } catch (error) {
                console.error("Error loading gudang data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-3">
                    <Loader2 size={32} className="animate-spin text-amber-500 mx-auto" />
                    <p className="text-sm font-semibold text-slate-400">Memuat data gudang...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            {/* Header */}
            <GudangNavbar
                title="Data Gudang"
                subtitle="SIKHAKI — Keluar masuk barang & grafik stok"
                action={{
                    label: "Stok Barang",
                    href: "/stok-barang",
                    icon: Package
                }}
            />

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Package size={16} className="text-amber-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{stokData.length}</p>
                        <p className="text-xs font-semibold text-slate-400">Total Barang</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Warehouse size={16} className="text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">
                            {stokData.reduce((sum, item) => sum + item.data.length, 0)}
                        </p>
                        <p className="text-xs font-semibold text-slate-400">Total Catatan</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package size={16} className="text-blue-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">
                            {stokData.reduce((sum, item) => sum + item.data.reduce((s, d) => s + d.pengambilan, 0), 0)}
                        </p>
                        <p className="text-xs font-semibold text-slate-400">Total Pengambilan</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Package size={16} className="text-purple-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">
                            {stokData.length > 0 ? stokData[0].data.length : 0}
                        </p>
                        <p className="text-xs font-semibold text-slate-400">Tanggal Tercatat</p>
                    </div>
                </div>


                {/* Stock Charts */}
                <StockChart data={stokData} />
            </main>
        </div>
    );
}
