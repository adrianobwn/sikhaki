"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AREAS, SHIFTS } from "@/constants/areas";
import SummaryCards from "@/components/admin/SummaryCards";
import ActivityChart from "@/components/admin/ActivityChart";
import GarbagePieChart from "@/components/admin/GarbagePieChart";
import DataTable from "@/components/admin/DataTable";
import ReportDetailModal, { ReportDetail } from "@/components/admin/ReportDetailModal";
import { Search, Calendar, Filter, Users, ClipboardList, CheckCircle2, Trash2, AlertTriangle, ChevronDown, LogOut, Download } from "lucide-react";

// --- Mock data untuk demo ---
const MOCK_CHART_DATA = [
  { shift: "P", laporan: 8, selesai: 6 },
  { shift: "NS", laporan: 12, selesai: 10 },
  { shift: "MD", laporan: 5, selesai: 5 },
  { shift: "S", laporan: 9, selesai: 7 },
  { shift: "M", laporan: 4, selesai: 3 },
  { shift: "P1", laporan: 3, selesai: 3 },
  { shift: "P2", laporan: 2, selesai: 2 },
];

const MOCK_TABLE_DATA: ReportDetail[] = [
  {
    id: "1", waktu: "06:15", petugas: "Andi Pratama", area: "Area 1", shift: "P", status: "selesai", kendala: "",
    kebersihan: { sudahDibersihkan: "Lobby Lt.1, Koridor Utama, Toilet Pengunjung", belumDibersihkan: "-" },
    sampah: { infeksius: 3.2, anorganik: 5.1, safetyBox: 1, kardus: 2 },
    logistik: { plastikKuning90: 5, plastikKuning60: 3, plastikKuning40: 10, plastikHitam90: 4, plastikHitam60: 2, plastikHitam40: 8, plastikUngu: 3, plastikCoklat: 2, safetyBox: 5, handTowel: 10 },
    foto: "https://placehold.co/400x300/e2e8f0/64748b?text=Foto+Absen+Andi",
  },
  {
    id: "2", waktu: "07:00", petugas: "Budi Santoso", area: "Area 5", shift: "NS", status: "selesai", kendala: "",
    kebersihan: { sudahDibersihkan: "Ruang Rawat Inap Lt.3, Nurse Station", belumDibersihkan: "Pantry" },
    sampah: { infeksius: 2.5, anorganik: 4.0, safetyBox: 2, kardus: 1 },
    logistik: { plastikKuning90: 3, plastikKuning60: 5, plastikKuning40: 8, plastikHitam90: 2, plastikHitam60: 4, plastikHitam40: 6, plastikUngu: 2, plastikCoklat: 1, safetyBox: 3, handTowel: 8 },
    foto: "https://placehold.co/400x300/e2e8f0/64748b?text=Foto+Absen+Budi",
  },
  {
    id: "3", waktu: "07:30", petugas: "Citra Dewi", area: "Area 12", shift: "NS", status: "kendala", kendala: "Mesin pel rusak di IGD Lt.2",
    kebersihan: { sudahDibersihkan: "IGD Lt.1", belumDibersihkan: "IGD Lt.2 (mesin pel rusak)" },
    sampah: { infeksius: 6.0, anorganik: 3.5, safetyBox: 4, kardus: 0 },
    logistik: { plastikKuning90: 8, plastikKuning60: 6, plastikKuning40: 12, plastikHitam90: 3, plastikHitam60: 2, plastikHitam40: 5, plastikUngu: 5, plastikCoklat: 3, safetyBox: 8, handTowel: 15 },
    foto: "https://placehold.co/400x300/fef2f2/dc2626?text=Foto+Absen+Citra",
  },
  {
    id: "4", waktu: "10:10", petugas: "Doni Saputra", area: "Area 9", shift: "MD", status: "selesai", kendala: "",
    kebersihan: { sudahDibersihkan: "Poliklinik Umum, Apotek, Kasir", belumDibersihkan: "-" },
    sampah: { infeksius: 1.5, anorganik: 6.0, safetyBox: 0, kardus: 3 },
    logistik: { plastikKuning90: 2, plastikKuning60: 3, plastikKuning40: 5, plastikHitam90: 5, plastikHitam60: 3, plastikHitam40: 7, plastikUngu: 1, plastikCoklat: 2, safetyBox: 2, handTowel: 6 },
    foto: "https://placehold.co/400x300/e2e8f0/64748b?text=Foto+Absen+Doni",
  },
  {
    id: "5", waktu: "14:05", petugas: "Eka Wati", area: "Area 16", shift: "S", status: "proses", kendala: "Stok plastik 90 habis",
    kebersihan: { sudahDibersihkan: "Ruang Operasi Lt.2", belumDibersihkan: "Ruang Operasi Lt.3 (belum selesai)" },
    sampah: { infeksius: 8.0, anorganik: 2.0, safetyBox: 6, kardus: 0 },
    logistik: { plastikKuning90: 0, plastikKuning60: 2, plastikKuning40: 4, plastikHitam90: 0, plastikHitam60: 1, plastikHitam40: 3, plastikUngu: 4, plastikCoklat: 2, safetyBox: 10, handTowel: 12 },
    foto: "https://placehold.co/400x300/fefce8/a16207?text=Foto+Absen+Eka",
  },
  {
    id: "6", waktu: "14:30", petugas: "Fajar Ramadhan", area: "Area 17", shift: "S", status: "selesai", kendala: "",
    kebersihan: { sudahDibersihkan: "Laboratorium, Radiologi", belumDibersihkan: "-" },
    sampah: { infeksius: 4.0, anorganik: 3.0, safetyBox: 3, kardus: 1 },
    logistik: { plastikKuning90: 4, plastikKuning60: 3, plastikKuning40: 6, plastikHitam90: 3, plastikHitam60: 2, plastikHitam40: 4, plastikUngu: 2, plastikCoklat: 1, safetyBox: 4, handTowel: 5 },
    foto: "https://placehold.co/400x300/e2e8f0/64748b?text=Foto+Absen+Fajar",
  },
  {
    id: "7", waktu: "22:15", petugas: "Gita Permata", area: "Area 20", shift: "M", status: "selesai", kendala: "",
    kebersihan: { sudahDibersihkan: "ICU, NICU, Koridor Lt.4", belumDibersihkan: "-" },
    sampah: { infeksius: 5.5, anorganik: 2.5, safetyBox: 3, kardus: 0 },
    logistik: { plastikKuning90: 6, plastikKuning60: 4, plastikKuning40: 8, plastikHitam90: 2, plastikHitam60: 1, plastikHitam40: 3, plastikUngu: 3, plastikCoklat: 2, safetyBox: 6, handTowel: 10 },
    foto: "https://placehold.co/400x300/e2e8f0/64748b?text=Foto+Absen+Gita",
  },
  {
    id: "8", waktu: "06:45", petugas: "Heri Gunawan", area: "Area 2", shift: "P1", status: "selesai", kendala: "",
    kebersihan: { sudahDibersihkan: "Musholla, Kantin, Area Parkir", belumDibersihkan: "-" },
    sampah: { infeksius: 0.5, anorganik: 8.0, safetyBox: 0, kardus: 5 },
    logistik: { plastikKuning90: 1, plastikKuning60: 2, plastikKuning40: 3, plastikHitam90: 6, plastikHitam60: 5, plastikHitam40: 10, plastikUngu: 0, plastikCoklat: 3, safetyBox: 1, handTowel: 4 },
    foto: "https://placehold.co/400x300/e2e8f0/64748b?text=Foto+Absen+Heri",
  },
];

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

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    shift: "",
    area: "",
    petugas: "",
  });

  const [tableData] = useState<ReportDetail[]>(MOCK_TABLE_DATA);
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [kendalaPopup, setKendalaPopup] = useState<string | null>(null);

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
    console.log("🔍 Filter:", filters);
  };

  const handleView = (id: string) => {
    const report = tableData.find((r) => r.id === id);
    if (report) setSelectedReport(report);
  };

  const handleLogout = () => {
    window.location.reload();
  };

  const handleExport = () => {
    const headers = [
      "ID", "Waktu", "Petugas", "Area", "Shift", "Status", "Kendala",
      "Sudah Dibersihkan", "Belum Dibersihkan",
      "Infeksius (kg)", "Anorganik (kg)", "Safety Box (kg)", "Kardus (kg)",
      "Plastik Kuning 90", "Plastik Kuning 60", "Plastik Kuning 40",
      "Plastik Hitam 90", "Plastik Hitam 60", "Plastik Hitam 40",
      "Plastik Ungu", "Plastik Coklat", "Safety Box (logistik)", "Hand Towel",
    ];

    const rows = tableData.map((r) => [
      r.id, r.waktu, r.petugas, r.area, r.shift, r.status, `"${r.kendala}"`,
      `"${r.kebersihan.sudahDibersihkan}"`, `"${r.kebersihan.belumDibersihkan}"`,
      r.sampah.infeksius, r.sampah.anorganik, r.sampah.safetyBox, r.sampah.kardus,
      r.logistik.plastikKuning90, r.logistik.plastikKuning60, r.logistik.plastikKuning40,
      r.logistik.plastikHitam90, r.logistik.plastikHitam60, r.logistik.plastikHitam40,
      r.logistik.plastikUngu, r.logistik.plastikCoklat, r.logistik.safetyBox, r.logistik.handTowel,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-sikhaki-${filters.tanggal}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalLaporan = tableData.length;
  const areaSelesai = tableData.filter((r) => r.status === "selesai").length;
  const totalSampah = tableData.reduce(
    (sum, r) => sum + r.sampah.infeksius + r.sampah.anorganik + r.sampah.safetyBox + r.sampah.kardus,
    0
  );
  const totalKendala = tableData.filter((r) => r.kendala).length;

  // Aggregate garbage data for pie chart
  const garbageAggregate = {
    infeksius: parseFloat(tableData.reduce((s, r) => s + r.sampah.infeksius, 0).toFixed(1)),
    anorganik: parseFloat(tableData.reduce((s, r) => s + r.sampah.anorganik, 0).toFixed(1)),
    safetyBox: parseFloat(tableData.reduce((s, r) => s + r.sampah.safetyBox, 0).toFixed(1)),
    kardus: parseFloat(tableData.reduce((s, r) => s + r.sampah.kardus, 0).toFixed(1)),
  };

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
            <span className="text-xs font-semibold text-indigo-200 hidden md:block">{getFormattedDate()}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-indigo-200 hover:text-white hover:bg-red-500/30 rounded-xl transition-colors text-sm font-semibold"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
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
          <ActivityChart data={MOCK_CHART_DATA} />

          {/* Garbage Pie Chart */}
          <GarbagePieChart data={garbageAggregate} />
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
                className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                <Download size={14} />
                Export CSV
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
