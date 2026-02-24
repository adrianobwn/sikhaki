"use client";

import React, { useState } from "react";
import { Eye, AlertTriangle, CheckCircle2, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 20;

const shiftColors: Record<string, string> = {
  P: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  P1: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  P2: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  NS: "bg-blue-100 text-blue-700 border border-blue-200",
  "NS 2": "bg-sky-100 text-sky-700 border border-sky-200",
  MD: "bg-violet-100 text-violet-700 border border-violet-200",
  "MD 2": "bg-purple-100 text-purple-700 border border-purple-200",
  S: "bg-amber-100 text-amber-700 border border-amber-200",
  M: "bg-slate-200 text-slate-700 border border-slate-300",
  L: "bg-gray-100 text-gray-500 border border-gray-200",
};

const getShiftColor = (shift: string) =>
  shiftColors[shift] || "bg-indigo-100 text-indigo-700 border border-indigo-200";

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

const statusConfig: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
  selesai: {
    bg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: <CheckCircle2 size={12} className="shrink-0" />,
    label: "Selesai",
  },
  proses: {
    bg: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: <Clock size={12} className="shrink-0" />,
    label: "Proses",
  },
  kendala: {
    bg: "bg-red-50 text-red-700 border border-red-200",
    icon: <AlertTriangle size={12} className="shrink-0" />,
    label: "Kendala",
  },
};

export default function DataTable({ data, onView, onKendalaClick }: DataTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  // Reset ke halaman 1 jika data berubah
  React.useEffect(() => {
    setPage(0);
  }, [data]);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="text-left p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider w-[70px]">Waktu</th>
              <th className="text-left p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider w-[140px]">Petugas</th>
              <th className="text-left p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider">Area</th>
              <th className="text-center p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider w-[70px]">Shift</th>
              <th className="text-center p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider w-[100px]">Status</th>
              <th className="text-left p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider w-[200px]">Kendala</th>
              <th className="text-center p-4 font-semibold uppercase text-[11px] text-slate-500 tracking-wider w-[80px]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-12 text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                      <AlertTriangle size={20} className="text-slate-300" />
                    </div>
                    <p className="font-semibold">Tidak ada data laporan</p>
                    <p className="text-xs text-slate-300">Coba ubah filter tanggal atau shift</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => {
                const config = statusConfig[row.status] || statusConfig.selesai;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-100 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                  >
                    {/* Waktu */}
                    <td className="p-4">
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                        {row.waktu}
                      </span>
                    </td>

                    {/* Petugas */}
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 text-sm">{row.petugas}</span>
                    </td>

                    {/* Area - with proper truncation + tooltip */}
                    <td className="p-4">
                      <span
                        className="text-slate-600 text-xs leading-relaxed line-clamp-2"
                        title={row.area}
                      >
                        {row.area}
                      </span>
                    </td>

                    {/* Shift */}
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${getShiftColor(row.shift)}`}>
                        {row.shift}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.bg}`}>
                        {config.icon}
                        {config.label}
                      </span>
                    </td>

                    {/* Kendala */}
                    <td className="p-4">
                      {row.kendala ? (
                        <button
                          onClick={() => onKendalaClick?.(row.kendala)}
                          className="group flex items-start gap-2 text-left w-full max-w-[200px] p-2 -m-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Klik untuk lihat detail kendala"
                        >
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-200 transition-colors">
                            <AlertTriangle size={10} className="text-red-600" />
                          </div>
                          <span className="text-xs text-red-700 font-medium leading-relaxed line-clamp-2 group-hover:text-red-800 transition-colors">
                            {row.kendala}
                          </span>
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">— Tidak ada</span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onView(row.id)}
                        className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors active:scale-95"
                      >
                        <Eye size={13} />
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-500 font-medium">
            Halaman {page + 1} dari {totalPages} ({data.length} data)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
