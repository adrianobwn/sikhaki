"use client";

import React from "react";
import { Eye, AlertTriangle } from "lucide-react";

export interface ReportRow {
  id: string;
  waktu: string;
  petugas: string;
  area: string;
  shift: string;
  status: "selesai" | "proses" | "kendala";
  kendala: string;
}

interface DataTableProps {
  data: ReportRow[];
  onView: (id: string) => void;
  onKendalaClick?: (text: string) => void;
}

const statusStyles: Record<string, string> = {
  selesai: "bg-emerald-100 text-emerald-700",
  proses: "bg-amber-100 text-amber-700",
  kendala: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  selesai: "✓ Selesai",
  proses: "⏳ Proses",
  kendala: "⚠ Kendala",
};

export default function DataTable({ data, onView, onKendalaClick }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="text-left p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider">Waktu</th>
            <th className="text-left p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider">Petugas</th>
            <th className="text-left p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider">Area</th>
            <th className="text-left p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider">Shift</th>
            <th className="text-left p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider">Status</th>
            <th className="text-left p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider">Kendala</th>
            <th className="text-center p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-8 text-slate-400 font-medium">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-slate-100 hover:bg-indigo-50/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
              >
                <td className="p-4 font-mono text-xs text-slate-600">{row.waktu}</td>
                <td className="p-4 font-semibold text-slate-800">{row.petugas}</td>
                <td className="p-4 text-slate-600">{row.area}</td>
                <td className="p-4">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg text-xs font-bold">
                    {row.shift}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[row.status]}`}
                  >
                    {statusLabels[row.status]}
                  </span>
                </td>
                <td className="p-4">
                  {row.kendala ? (
                    <button
                      onClick={() => onKendalaClick?.(row.kendala)}
                      className="flex items-center gap-1 text-red-600 text-xs font-medium hover:text-red-800 hover:underline cursor-pointer text-left"
                      title="Klik untuk lihat detail"
                    >
                      <AlertTriangle size={14} className="shrink-0" />
                      <span className="max-w-[120px] truncate">{row.kendala}</span>
                    </button>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onView(row.id)}
                    className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Eye size={14} />
                    Detail
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
