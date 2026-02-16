"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface ChartDataItem {
  shift: string;
  laporan: number;
  selesai: number;
  kendala: number;
}

interface ActivityChartProps {
  data: ChartDataItem[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={16} className="text-indigo-500" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Aktivitas Harian per Shift
        </h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="shift"
              tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: "none",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 12,
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: 12, fontWeight: 600 }}
              iconType="circle"
            />
            <Bar dataKey="laporan" fill="#6366f1" name="Total Laporan" radius={[6, 6, 0, 0]} />
            <Bar dataKey="selesai" fill="#10b981" name="Selesai" radius={[6, 6, 0, 0]} />
            <Bar dataKey="kendala" fill="#ef4444" name="Kendala" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
