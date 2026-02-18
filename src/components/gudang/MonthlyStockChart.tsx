"use client";

import React, { useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";
import { TrendingUp, Calendar, Filter } from "lucide-react";

import { type StokTimeSeriesItem } from "@/lib/supabase";

interface MonthlyStockChartProps {
    data: StokTimeSeriesItem[];
}

const CHART_COLORS = [
    "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444",
    "#f97316", "#eab308", "#22c55e", "#06b6d4",
];

export default function MonthlyStockChart({ data }: MonthlyStockChartProps) {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });

    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const [year, month] = selectedMonth.split("-").map(Number);

        return data
            .map((item) => {
                const total = item.data.reduce((sum, d) => {
                    const date = new Date(d.tanggal);
                    if (date.getFullYear() === year && date.getMonth() + 1 === month) {
                        return sum + d.pengambilan;
                    }
                    return sum;
                }, 0);

                return {
                    name: item.nama_barang,
                    unit: item.satuan, // Pass unit to chart data
                    total,
                };
            })
            .filter((item) => item.total > 0) // Only show items with consumption
            .sort((a, b) => b.total - a.total) // Sort by highest consumption
            .slice(0, 15); // Top 15 items to keep chart readable
    }, [data, selectedMonth]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-600" />
                    <h3 className="text-base font-bold text-slate-800">
                        Pengambilan Barang Bulan Ini
                    </h3>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <Calendar size={14} className="text-slate-400 ml-2" />
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
                    />
                </div>
            </div>

            {chartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Filter size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">Tidak ada data pengambilan pada bulan ini</p>
                </div>
            ) : (
                <div className="h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={120}
                                tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: "#f8fafc", opacity: 0.5 }}
                                contentStyle={{
                                    border: "none",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    fontSize: "12px",
                                    fontWeight: 600
                                }}
                                formatter={(value: any, name: any, props: any) => [`${value} ${props.payload.unit || ''}`, name]}
                            />
                            <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={20}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                                <LabelList
                                    dataKey="total"
                                    position="right"
                                    style={{ fontSize: 11, fontWeight: "bold", fill: "#64748b" }}
                                    content={(props: any) => {
                                        const { x, y, width, height, value } = props;
                                        const unit = props.payload?.unit || '';
                                        return (
                                            <text x={x + width + 5} y={y + height / 1.5} fill="#64748b" fontSize={11} fontWeight="bold">
                                                {value} {unit}
                                            </text>
                                        );
                                    }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
