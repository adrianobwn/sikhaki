"use client";

import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    BarChart,
    Bar,
    Cell,
} from "recharts";
import { TrendingUp, Package, X, Maximize2, BarChart2, LayoutGrid } from "lucide-react";

interface StokTimeSeriesItem {
    nama_barang: string;
    data: { tanggal: string; pengambilan: number }[];
}

interface StockChartProps {
    data: StokTimeSeriesItem[];
}

const CHART_COLORS = [
    "#2563eb", "#7c3aed", "#0891b2", "#0d9488",
    "#059669", "#65a30d", "#ca8a04", "#ea580c",
    "#dc2626", "#db2777", "#9333ea", "#4f46e5",
];

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function formatDateFull(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

export default function StockChart({ data }: StockChartProps) {
    const [selectedItem, setSelectedItem] = useState<{ item: StokTimeSeriesItem; color: string } | null>(null);
    // Removed viewMode state, always "grid"

    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [selectedItem]);

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-indigo-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                        Grafik Pengambilan Barang
                    </h3>
                </div>
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm font-medium">
                    Belum ada data stok barang
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-indigo-500" />
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                            Grafik Pengambilan Barang per Tanggal
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((item, idx) => {
                        const chartData = item.data.map((d) => ({
                            tanggal: formatDate(d.tanggal),
                            Pengambilan: d.pengambilan,
                        }));
                        const color = CHART_COLORS[idx % CHART_COLORS.length];
                        const totalPengambilan = item.data.reduce((s, d) => s + d.pengambilan, 0);

                        return (
                            <div
                                key={item.nama_barang}
                                className="border border-slate-200 rounded-xl p-3 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group bg-white"
                                onClick={() => setSelectedItem({ item, color })}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.nama_barang}</h4>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] font-bold text-slate-400">{totalPengambilan}</span>
                                        <Maximize2 size={10} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                </div>
                                <div className="h-28 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                            <XAxis dataKey="tanggal" tick={{ fontSize: 7, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={Math.max(0, Math.floor(chartData.length / 4) - 1)} />
                                            <YAxis tick={{ fontSize: 8, fill: "#cbd5e1" }} axisLine={false} tickLine={false} />
                                            <Line
                                                type="monotone"
                                                dataKey="Pengambilan"
                                                stroke={color}
                                                strokeWidth={2}
                                                strokeDasharray="5 3"
                                                dot={{ r: 3, fill: color, strokeWidth: 0 }}
                                                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                                            >
                                                <LabelList dataKey="Pengambilan" position="top" style={{ fontSize: 8, fontWeight: 700, fill: color }} />
                                            </Line>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Popup Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{selectedItem.item.nama_barang}</h3>
                                <p className="text-xs text-slate-400 font-medium">
                                    Total Pengambilan:{" "}
                                    <span style={{ color: selectedItem.color }} className="font-bold text-sm">
                                        {selectedItem.item.data.reduce((s, d) => s + d.pengambilan, 0)}
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                                <X size={18} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Chart */}
                        <div className="p-6">
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={selectedItem.item.data.map((d) => ({
                                            tanggal: formatDate(d.tanggal),
                                            Pengambilan: d.pengambilan,
                                        }))}
                                        margin={{ top: 25, right: 20, left: 0, bottom: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis
                                            dataKey="tanggal"
                                            tick={{ fontSize: 11, fontWeight: 600, fill: "#64748b" }}
                                            axisLine={{ stroke: "#e2e8f0" }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ border: "none", borderRadius: 12, fontWeight: 600, fontSize: 13, boxShadow: "0 4px 12px rgb(0 0 0 / 0.15)" }}
                                            labelStyle={{ fontWeight: 700, marginBottom: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="Pengambilan"
                                            stroke={selectedItem.color}
                                            strokeWidth={2.5}
                                            strokeDasharray="6 3"
                                            dot={{ r: 5, fill: selectedItem.color, strokeWidth: 2, stroke: "#fff" }}
                                            activeDot={{ r: 8, strokeWidth: 3, stroke: "#fff" }}
                                        >
                                            <LabelList dataKey="Pengambilan" position="top" style={{ fontSize: 12, fontWeight: 700, fill: selectedItem.color }} />
                                        </Line>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Data Table */}
                            <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="text-left py-2.5 px-4 font-bold text-slate-600 text-xs uppercase">Tanggal</th>
                                            <th className="text-right py-2.5 px-4 font-bold text-slate-600 text-xs uppercase">Pengambilan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedItem.item.data.map((d, i) => (
                                            <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                                                <td className="py-2.5 px-4 text-slate-700 font-medium">{formatDateFull(d.tanggal)}</td>
                                                <td className="py-2.5 px-4 text-right">
                                                    <span
                                                        className="font-bold px-2.5 py-1 rounded-lg text-xs"
                                                        style={{ backgroundColor: selectedItem.color + "15", color: selectedItem.color }}
                                                    >
                                                        {d.pengambilan}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
