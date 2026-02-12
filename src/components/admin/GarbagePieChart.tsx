"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Trash2 } from "lucide-react";

interface GarbageData {
  infeksius: number;
  anorganik: number;
  safetyBox: number;
  kardus: number;
}

interface GarbagePieChartProps {
  data: GarbageData;
}

const COLORS = ["#eab308", "#64748b", "#f97316", "#a8a29e"];

const LABELS: Record<string, string> = {
  infeksius: "Infeksius",
  anorganik: "Anorganik",
  safetyBox: "Safety Box",
  kardus: "Kardus",
};

export default function GarbagePieChart({ data }: GarbagePieChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: LABELS[key] || key,
    value,
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trash2 size={16} className="text-orange-500" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Komposisi Sampah
        </h3>
        <span className="ml-auto text-xs font-semibold text-slate-400">
          Total: {total} kg
        </span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} kg`, ""]}
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
              formatter={(value: string) => (
                <span className="text-slate-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
