"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AREAS, SHIFTS } from "@/constants/areas";
import SummaryCards from "@/components/admin/SummaryCards";
import ActivityChart from "@/components/admin/ActivityChart";
import GarbagePieChart from "@/components/admin/GarbagePieChart";

import DataTable from "@/components/admin/DataTable";
import ReportDetailModal, { ReportDetail } from "@/components/admin/ReportDetailModal";
import { Search, Calendar, Filter, Users, ClipboardList, CheckCircle2, Trash2, AlertTriangle, ChevronDown, LogOut, Download, Loader2, ArrowLeft } from "lucide-react";
import { fetchLaporan, getDashboardStats, getActivityChartData, getGarbagePieData, type LaporanRow } from "@/lib/supabase";
import * as XLSX from 'xlsx';

function getFormattedDate(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return now.toLocaleDateString('id-ID', options);
}

// Convert database row to ReportDetail format
function convertToReportDetail(row: LaporanRow): ReportDetail {
  return {
    id: row.id,
    waktu: row.waktu,
    petugas: row.petugas,
    area: row.area_nama,
    shift: row.shift,
    status: row.status,
    kendala: row.kendala || "",
    kebersihan: {
      sudahDibersihkan: row.sudah_dibersihkan || "",
      belumDibersihkan: row.belum_dibersihkan || "",
    },
    sampah: {
      infeksius: Number(row.sampah_infeksius),
      anorganik: Number(row.sampah_anorganik),
      safetyBox: Number(row.sampah_safety_box),
      kardus: Number(row.sampah_kardus),
    },
    logistik: {
      plastikKuning90: row.logistik_kuning_90,
      plastikKuning60: row.logistik_kuning_60,
      plastikKuning40: row.logistik_kuning_40,
      plastikHitam90: row.logistik_hitam_90,
      plastikHitam60: row.logistik_hitam_60,
      plastikHitam40: row.logistik_hitam_40,
      plastikUngu: row.logistik_ungu,
      plastikCoklat: row.logistik_coklat,
      safetyBox: row.logistik_safety_box,
      handTowel: row.logistik_hand_towel,
    },
    foto: row.foto_url || null,
  };
}

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    shift: "",
    area: "",
    petugas: "",
  });

  const [tableData, setTableData] = useState<ReportDetail[]>([]);
  const [chartData, setChartData] = useState<Array<{ shift: string; laporan: number; selesai: number; kendala: number }>>([]);
  const [stats, setStats] = useState({ totalLaporan: 0, areaSelesai: 0, totalSampah: 0, totalKendala: 0 });
  const [garbageData, setGarbageData] = useState({ infeksius: 0, anorganik: 0, safetyBox: 0, kardus: 0 });

  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [kendalaPopup, setKendalaPopup] = useState<string | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [reports, statsData, activityData, pieData] = await Promise.all([
          fetchLaporan(filters),
          getDashboardStats(filters.tanggal),
          getActivityChartData(filters.tanggal),
          getGarbagePieData(filters.tanggal),
        ]);

        setTableData(reports.map(convertToReportDetail));
        setStats(statsData ?? { totalLaporan: 0, areaSelesai: 0, totalSampah: 0, totalKendala: 0 });
        setChartData(activityData);
        setGarbageData(pieData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [filters]);

  useEffect(() => {
    if (kendalaPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [kendalaPopup]);

  const handleSearch = () => {
    // Trigger re-fetch by updating filters (already handled by useEffect)
    console.log("🔍 Filter:", filters);
  };

  const handleView = (id: string) => {
    const report = tableData.find((r) => r.id === id);
    if (report) setSelectedReport(report);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sikhaki_admin_auth");
    window.location.replace("/");
  };

  const handleExport = () => {
    if (tableData.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    // Prepare data for Excel
    const excelData = tableData.map((r) => ({
      "ID": r.id,
      "Waktu": r.waktu,
      "Petugas": r.petugas,
      "Area": r.area,
      "Shift": r.shift,
      "Status": r.status,
      "Kendala": r.kendala || "-",
      "Sudah Dibersihkan": r.kebersihan.sudahDibersihkan || "-",
      "Belum Dibersihkan": r.kebersihan.belumDibersihkan || "-",
      "Infeksius (kg)": r.sampah.infeksius,
      "Anorganik (kg)": r.sampah.anorganik,
      "Safety Box (kg)": r.sampah.safetyBox,
      "Kardus (kg)": r.sampah.kardus,
      "Plastik Kuning 90": r.logistik.plastikKuning90,
      "Plastik Kuning 60": r.logistik.plastikKuning60,
      "Plastik Kuning 40": r.logistik.plastikKuning40,
      "Plastik Hitam 90": r.logistik.plastikHitam90,
      "Plastik Hitam 60": r.logistik.plastikHitam60,
      "Plastik Hitam 40": r.logistik.plastikHitam40,
      "Plastik Ungu": r.logistik.plastikUngu,
      "Plastik Coklat": r.logistik.plastikCoklat,
      "Safety Box (logistik)": r.logistik.safetyBox,
      "Hand Towel": r.logistik.handTowel,
    }));

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");

    // Set column widths
    const colWidths = [
      { wch: 36 }, // ID
      { wch: 8 },  // Waktu
      { wch: 20 }, // Petugas
      { wch: 50 }, // Area
      { wch: 8 },  // Shift
      { wch: 10 }, // Status
      { wch: 40 }, // Kendala
      { wch: 50 }, // Sudah Dibersihkan
      { wch: 50 }, // Belum Dibersihkan
      { wch: 14 }, // Infeksius
      { wch: 14 }, // Anorganik
      { wch: 14 }, // Safety Box
      { wch: 12 }, // Kardus
      { wch: 16 }, // Plastik Kuning 90
      { wch: 16 }, // Plastik Kuning 60
      { wch: 16 }, // Plastik Kuning 40
      { wch: 16 }, // Plastik Hitam 90
      { wch: 16 }, // Plastik Hitam 60
      { wch: 16 }, // Plastik Hitam 40
      { wch: 14 }, // Plastik Ungu
      { wch: 14 }, // Plastik Coklat
      { wch: 20 }, // Safety Box (logistik)
      { wch: 12 }, // Hand Towel
    ];
    ws['!cols'] = colWidths;

    // Generate Excel file
    XLSX.writeFile(wb, `laporan-sikhaki-${filters.tanggal}.xlsx`);
  };

  const totalLaporan = stats.totalLaporan;
  const areaSelesai = stats.areaSelesai;
  const totalSampah = stats.totalSampah;
  const totalKendala = stats.totalKendala;

  return (
    <div className="min-h-screen">
      {/* Admin Header - Indigo Theme */}
      <header className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 shadow-lg shadow-indigo-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 relative bg-white rounded-xl p-1 shadow-sm">
              <Image
                src="/Logo-RSUI.png"
                alt="Logo RSUI"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">Dashboard Admin</h1>
              <p className="text-xs font-medium text-indigo-200">SIKHAKI — Sistem Harian Kebersihan</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-white hidden md:block">{getFormattedDate()}</span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-white hover:bg-red-500/30 rounded-xl transition-colors text-sm font-semibold"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin text-indigo-600" />
              <p className="text-sm text-slate-500 font-medium">Memuat data dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <SummaryCards
              items={[
                { label: "Total Laporan", value: totalLaporan, icon: <ClipboardList size={24} />, color: "indigo" },
                { label: "Area Selesai", value: areaSelesai, icon: <CheckCircle2 size={24} />, color: "emerald" },
                { label: "Total Sampah (kg)", value: parseFloat(totalSampah.toFixed(1)), icon: <Trash2 size={24} />, color: "orange" },
                { label: "Kendala", value: totalKendala, icon: <AlertTriangle size={24} />, color: "red" },
              ]}
            />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Chart */}
              <ActivityChart data={chartData} />

              {/* Garbage Pie Chart */}
              <GarbagePieChart data={garbageData} />
            </div>



            {/* Data Table Section with Filter inside */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 flex items-center gap-2">
                  <ClipboardList size={16} className="text-indigo-500" />
                  Riwayat Laporan
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">{tableData.length} data</span>
                  <button
                    onClick={handleExport}
                    disabled={tableData.length === 0}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={14} />
                    Export Excel
                  </button>
                </div>
              </div>

              {/* Filter Bar inside table section */}
              <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <Filter size={14} className="text-indigo-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Filter</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
                      <Calendar size={12} />
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={filters.tanggal}
                      onChange={(e) => setFilters({ ...filters, tanggal: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow bg-white"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
                      <ChevronDown size={12} />
                      Shift
                    </label>
                    <select
                      value={filters.shift}
                      onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Semua Shift</option>
                      {SHIFTS.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.code} — {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
                      <ChevronDown size={12} />
                      Area
                    </label>
                    <select
                      value={filters.area}
                      onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Semua Area</option>
                      {AREAS.map((a) => (
                        <option key={a.id} value={String(a.id)}>
                          {a.id}. {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
                      <Users size={12} />
                      Petugas
                    </label>
                    <input
                      type="text"
                      value={filters.petugas}
                      onChange={(e) => setFilters({ ...filters, petugas: e.target.value })}
                      placeholder="Cari nama..."
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleSearch}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-indigo-500/20 active:scale-[0.98]"
                    >
                      <Search size={16} />
                      Cari
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <DataTable data={tableData} onView={handleView} onKendalaClick={(text) => setKendalaPopup(text)} />
            </div>
          </>
        )}
      </main>

      {/* Report Detail Modal */}
      <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />

      {/* Kendala Popup */}
      {kendalaPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setKendalaPopup(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={16} className="text-red-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Detail Kendala</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{kendalaPopup}</p>
            <button
              onClick={() => setKendalaPopup(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
