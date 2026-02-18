"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
    Package, Plus, Calendar, Search,
    Download,
    Trash2, Pencil, LogOut, ArrowLeft,
    Loader2, AlertTriangle,
} from "lucide-react";
import GudangNavbar from "@/components/gudang/GudangNavbar";
import MonthlyStockChart from "@/components/gudang/MonthlyStockChart";
import StokBarangForm from "@/components/admin/StokBarangForm";
import { fetchStokBarang, deleteStokBarang, getStokTimeSeries, type StokBarangRow } from "@/lib/supabase";
import { Warehouse, TrendingUp } from "lucide-react";



export default function StokBarangPage() {
    const [data, setData] = useState<StokBarangRow[]>([]);
    const [chartData, setChartData] = useState<Array<{ nama_barang: string; satuan: string; data: { tanggal: string; pengambilan: number }[] }>>([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<StokBarangRow | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [rows, timeSeries] = await Promise.all([
                fetchStokBarang(filterDate || undefined),
                getStokTimeSeries()
            ]);
            setData(rows);
            setChartData(timeSeries);
        } catch (err) {
            console.error("Error loading stok:", err);
        } finally {
            setLoading(false);
        }
    }, [filterDate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            await deleteStokBarang(id);
            setDeleteConfirm(null);
            loadData();
        } catch (err) {
            console.error("Error deleting:", err);
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = (item: StokBarangRow) => {
        setEditItem(item);
        setFormOpen(true);
    };

    const handleAdd = () => {
        setEditItem(null);
        setFormOpen(true);
    };

    const handleExportExcel = () => {
        if (data.length === 0) return;

        const XLSX = require("xlsx");

        const rows = data.map((row, idx) => ({
            "No": idx + 1,
            "Nama Barang": row.nama_barang || "",
            "Satuan": row.satuan || "-",
            "Stok Awal": row.stok_awal,
            "Pengambilan": row.pengambilan,
            "Stok Sisa": row.stok_awal - row.pengambilan,
            "Tanggal": row.tanggal,
            "Keterangan": row.keterangan || "-",
        }));

        const ws = XLSX.utils.json_to_sheet(rows);
        ws["!cols"] = [
            { wch: 5 },   // No
            { wch: 25 },  // Nama Barang
            { wch: 10 },  // Satuan
            { wch: 12 },  // Stok Awal
            { wch: 12 },  // Pengambilan
            { wch: 12 },  // Stok Sisa
            { wch: 14 },  // Tanggal
            { wch: 25 },  // Keterangan
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Stok Barang");

        const dateStr = filterDate || new Date().toISOString().split("T")[0];
        XLSX.writeFile(wb, `stok-barang-${dateStr}.xlsx`);
    };



    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header */}
            {/* Header */}
            <GudangNavbar
                title="Stok Barang"
                subtitle="SIKHAKI — Manajemen Stok Logistik"
                action={{
                    label: "Gudang",
                    href: "/gudang",
                    icon: ArrowLeft
                }}
            />

            <main className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Package size={16} className="text-amber-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{chartData.length}</p>
                        <p className="text-xs font-semibold text-slate-400">Total Barang</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Warehouse size={16} className="text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">
                            {chartData.reduce((sum, item) => sum + item.data.length, 0)}
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
                            {chartData.reduce((sum, item) => sum + item.data.reduce((s, d) => s + d.pengambilan, 0), 0)}
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
                            {chartData.length > 0 ? chartData[0].data.length : 0}
                        </p>
                        <p className="text-xs font-semibold text-slate-400">Tanggal Tercatat</p>
                    </div>
                </div>

                {/* Stock Charts */}
                <MonthlyStockChart data={chartData} />

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAdd}
                            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm shadow-amber-500/20 active:scale-[0.98]"
                        >
                            <Plus size={16} />
                            Tambah Stok
                        </button>
                        <button
                            onClick={handleExportExcel}
                            disabled={data.length === 0}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={16} />
                            Export Excel
                        </button>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <div className="flex-1 w-full sm:max-w-xs">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                                <Calendar size={12} />
                                Filter Tanggal
                            </label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={loadData}
                                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                            >
                                <Search size={14} />
                                Cari
                            </button>
                            {filterDate && (
                                <button
                                    onClick={() => setFilterDate("")}
                                    className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 size={28} className="animate-spin text-amber-600" />
                                <p className="text-sm text-slate-500 font-medium">Memuat data stok...</p>
                            </div>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Package size={40} strokeWidth={1.5} className="mb-3" />
                            <p className="text-sm font-semibold">Belum ada data stok</p>
                            <p className="text-xs mt-1">Klik &quot;Tambah Stok&quot; untuk menambah data baru</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">No</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">Nama Barang</th>
                                        <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">Satuan</th>
                                        <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">Stok Awal</th>
                                        <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">Pengambilan</th>
                                        <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">Stok Sisa</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">Tanggal</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">Keterangan</th>
                                        <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.map((row, idx) => {
                                        const stokSisa = row.stok_awal - row.pengambilan;
                                        const isLow = row.stok_awal > 0 && stokSisa / row.stok_awal <= 0.3;
                                        const isCritical = row.stok_awal > 0 && stokSisa / row.stok_awal <= 0.1;

                                        return (
                                            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-3 text-slate-500 font-semibold">{idx + 1}</td>
                                                <td className="px-5 py-3 font-bold text-slate-800">{row.nama_barang}</td>
                                                <td className="px-5 py-3 text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 uppercase">
                                                        {row.satuan || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-center font-semibold text-slate-600">{row.stok_awal}</td>
                                                <td className="px-5 py-3 text-center font-semibold text-orange-600">{row.pengambilan}</td>
                                                <td className="px-5 py-3 text-center">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${isCritical
                                                            ? "bg-red-100 text-red-700"
                                                            : isLow
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "bg-emerald-100 text-emerald-700"
                                                            }`}
                                                    >
                                                        {stokSisa}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 font-semibold text-slate-600">
                                                    {new Date(row.tanggal).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                                <td className="px-5 py-3 text-slate-500 text-xs max-w-[200px] truncate">
                                                    {row.keterangan || "—"}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => handleEdit(row)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(row.id)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Form Modal */}
            <StokBarangForm
                isOpen={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditItem(null);
                }}
                onSuccess={loadData}
                editData={editItem}
            />

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle size={20} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Hapus Data</h3>
                                <p className="text-xs text-slate-500">Data yang dihapus tidak bisa dikembalikan.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-sm transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={deleting}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {deleting ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Menghapus...
                                    </>
                                ) : (
                                    "Hapus"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
