"use client";

import React, { useState, useEffect } from "react";
import { X, Package, Save, Loader2 } from "lucide-react";
import { STOK_BARANG_ITEMS } from "@/constants/stokBarang";
import { insertStokBarang, updateStokBarang, type StokBarangRow } from "@/lib/supabase";

interface StokBarangFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: StokBarangRow | null;
}

export default function StokBarangForm({ isOpen, onClose, onSuccess, editData }: StokBarangFormProps) {
    const [form, setForm] = useState({
        nama_barang: "",
        stok_awal: 0,
        pengambilan: 0,
        tanggal: new Date().toISOString().split("T")[0],
        satuan: "",
        keterangan: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editData) {
            setForm({
                nama_barang: editData.nama_barang,
                stok_awal: editData.stok_awal,
                pengambilan: editData.pengambilan,
                tanggal: editData.tanggal,
                satuan: (editData as any).satuan || "",
                keterangan: editData.keterangan || "",
            });
        } else {
            setForm({
                nama_barang: "",
                stok_awal: 0,
                pengambilan: 0,
                tanggal: new Date().toISOString().split("T")[0],
                satuan: "",
                keterangan: "",
            });
        }
        setError("");
    }, [editData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nama_barang) {
            setError("Pilih nama barang terlebih dahulu.");
            return;
        }
        if (form.pengambilan > form.stok_awal) {
            setError("Pengambilan tidak boleh melebihi stok awal.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            if (editData) {
                await updateStokBarang(editData.id, {
                    nama_barang: form.nama_barang,
                    stok_awal: form.stok_awal,
                    pengambilan: form.pengambilan,
                    tanggal: form.tanggal,
                    satuan: form.satuan || undefined,
                    keterangan: form.keterangan || undefined,
                });
            } else {
                await insertStokBarang({
                    nama_barang: form.nama_barang,
                    stok_awal: form.stok_awal,
                    pengambilan: form.pengambilan,
                    tanggal: form.tanggal,
                    satuan: form.satuan || undefined,
                    keterangan: form.keterangan || undefined,
                });
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError("Gagal menyimpan data. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Package size={16} className="text-white" />
                        </div>
                        <h2 className="text-base font-bold text-white">
                            {editData ? "Edit Stok Barang" : "Tambah Stok Barang"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Nama Barang */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                            Nama Barang
                        </label>
                        <select
                            value={form.nama_barang}
                            onChange={(e) => setForm({ ...form, nama_barang: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="">— Pilih Barang —</option>
                            {STOK_BARANG_ITEMS.map((item) => (
                                <option key={item.id} value={item.nama}>
                                    {item.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Satuan */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                            Satuan <span className="text-slate-400 font-normal">(opsional)</span>
                        </label>
                        <input
                            type="text"
                            value={form.satuan}
                            onChange={(e) => setForm({ ...form, satuan: e.target.value })}
                            placeholder="Contoh: Pcs, Rim, Box"
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                        />
                    </div>

                    {/* Stok Awal & Pengambilan */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                                Stok Awal
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={form.stok_awal}
                                onChange={(e) => setForm({ ...form, stok_awal: parseInt(e.target.value) || 0 })}
                                className="w-full border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                                Pengambilan
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={form.pengambilan}
                                onChange={(e) => setForm({ ...form, pengambilan: parseInt(e.target.value) || 0 })}
                                className="w-full border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                            />
                        </div>
                    </div>

                    {/* Tanggal */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                            Tanggal
                        </label>
                        <input
                            type="date"
                            value={form.tanggal}
                            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                        />
                    </div>

                    {/* Keterangan */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                            Keterangan <span className="text-slate-400 font-normal">(opsional)</span>
                        </label>
                        <textarea
                            value={form.keterangan}
                            onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                            rows={2}
                            placeholder="Catatan tambahan..."
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-amber-500/20 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Simpan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
