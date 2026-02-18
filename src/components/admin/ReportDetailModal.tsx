"use client";

import React, { useEffect } from "react";
import {
  X,
  User,
  Sparkles,
  Trash2,
  Package,
  MessageSquare,
  Clock,
  MapPin,
  Briefcase,
  Camera,
  Calendar,
} from "lucide-react";

export interface ReportDetail {
  id: string;
  waktu: string;
  tanggal?: string;
  petugas: string;
  area: string;
  shift: string;
  status: "selesai" | "proses" | "kendala";
  kendala: string;
  kebersihan: {
    sudahDibersihkan: string;
    belumDibersihkan: string;
  };
  sampah: {
    infeksius: number;
    anorganik: number;
    safetyBox: number;
    kardus: number;
  };
  logistik: {
    plastikKuning90: number;
    plastikKuning60: number;
    plastikKuning40: number;
    plastikHitam90: number;
    plastikHitam60: number;
    plastikHitam40: number;
    plastikUngu: number;
    plastikCoklat: number;
    safetyBox: number;
    handTowel: number;
  };
  foto: string | null;
}

interface ReportDetailModalProps {
  report: ReportDetail | null;
  onClose: () => void;
}

const statusStyles: Record<string, string> = {
  selesai: "bg-emerald-100/80 text-emerald-800 border-emerald-200",
  proses: "bg-amber-100/80 text-amber-800 border-amber-200",
  kendala: "bg-red-100/80 text-red-800 border-red-200",
};

export default function ReportDetailModal({ report, onClose }: ReportDetailModalProps) {
  useEffect(() => {
    if (report) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [report]);

  if (!report) return null;

  const totalSampah =
    report.sampah.infeksius +
    report.sampah.anorganik +
    report.sampah.safetyBox +
    report.sampah.kardus;

  // Use report date if available, otherwise fallback to current date
  const reportDate = report.tanggal ? new Date(report.tanggal + 'T00:00:00') : new Date();
  const tanggalLaporan = reportDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Short ID for display
  const shortId = report.id.substring(0, 8).toUpperCase();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header Fixed */}
        <div className="bg-white border-b border-slate-100 p-5 flex items-start justify-between shrink-0 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-slate-800">Laporan <span className="font-mono text-indigo-600">#{shortId}</span></h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${statusStyles[report.status]}`}>
                {report.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" />
                <span>{tanggalLaporan}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold">
                <Clock size={12} />
                {report.waktu}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">

          {/* Identity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <IdentityCard icon={<User size={18} />} label="Petugas" value={report.petugas} color="indigo" />
            <IdentityCard icon={<MapPin size={18} />} label="Area" value={report.area} color="emerald" />
            <IdentityCard icon={<Briefcase size={18} />} label="Shift" value={report.shift} color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
            {/* Left Column: Logistik & Sampah */}
            <div className="space-y-8">

              {/* Logistik & Stok */}
              <section>
                <SectionHeader icon={<Package size={18} className="text-blue-500" />} title="Logistik & Stok" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plastik Kuning */}
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                    <p className="text-xs font-bold text-yellow-800 mb-3 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/50"></span>
                      Plastik Kuning (Infeksius)
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <CompactStat label="90cm" value={report.logistik.plastikKuning90} bg="bg-white/60" />
                      <CompactStat label="60cm" value={report.logistik.plastikKuning60} bg="bg-white/60" />
                      <CompactStat label="40cm" value={report.logistik.plastikKuning40} bg="bg-white/60" />
                    </div>
                  </div>

                  {/* Plastik Hitam */}
                  <div className="bg-zinc-100 rounded-xl p-4 border border-zinc-200">
                    <p className="text-xs font-bold text-zinc-700 mb-3 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 shadow-sm shadow-zinc-800/50"></span>
                      Plastik Hitam (Domestik)
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <CompactStat label="90cm" value={report.logistik.plastikHitam90} bg="bg-white/60" />
                      <CompactStat label="60cm" value={report.logistik.plastikHitam60} bg="bg-white/60" />
                      <CompactStat label="40cm" value={report.logistik.plastikHitam40} bg="bg-white/60" />
                    </div>
                  </div>
                </div>

                {/* Lainnya */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <OtherItem label="Plastik Ungu" value={report.logistik.plastikUngu} icon="🟣" />
                  <OtherItem label="Plastik Coklat" value={report.logistik.plastikCoklat} icon="🟤" />
                  <OtherItem label="Safety Box" value={report.logistik.safetyBox} icon="📦" />
                  <OtherItem label="Hand Towel" value={report.logistik.handTowel} icon="🧻" />
                </div>
              </section>

              {/* Volume Sampah */}
              <section>
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                  <SectionHeader icon={<Trash2 size={18} className="text-orange-500" />} title="Volume Sampah" noBorder />
                  <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-200">
                    Total: {parseFloat(totalSampah.toFixed(1))} kg
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <GarbageItem label="Infeksius" value={report.sampah.infeksius} color="yellow" />
                  <GarbageItem label="Anorganik" value={report.sampah.anorganik} color="slate" />
                  <GarbageItem label="Safety Box" value={report.sampah.safetyBox} color="orange" />
                  <GarbageItem label="Kardus" value={report.sampah.kardus} color="stone" />
                </div>
              </section>

            </div>

            {/* Right Column: Kebersihan & Kendala */}
            <div className="space-y-8">

              {/* Kebersihan */}
              <section>
                <SectionHeader icon={<Sparkles size={18} className="text-teal-500" />} title="Kebersihan Area" />
                <div className="space-y-4">
                  <CleanlinessStatus
                    type="sudah"
                    text={report.kebersihan.sudahDibersihkan}
                  />
                  <CleanlinessStatus
                    type="belum"
                    text={report.kebersihan.belumDibersihkan}
                  />
                </div>
              </section>

              {/* Kendala Bubble */}
              {report.kendala && (
                <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/60 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0 shadow-sm shadow-red-100">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider">Kendala Lapangan</h4>
                      <p className="text-[10px] text-red-400 font-medium">Dilaporkan pukul {report.waktu}</p>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-3.5 border border-red-100">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium italic">&ldquo;{report.kendala}&rdquo;</p>
                  </div>
                </div>
              )}

              {/* Foto - Compact */}
              {report.foto && (
                <section className="pt-2">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                    <Camera size={16} className="text-slate-400" />
                    Bukti Absensi
                  </h3>
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 group">
                    <img
                      src={report.foto}
                      alt="Foto Absen"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white text-xs font-medium">
                        Diambil pada {report.waktu}
                      </p>
                    </div>
                  </div>
                </section>
              )}

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-5 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-lg shadow-slate-900/10 active:scale-95 hover:shadow-xl hover:shadow-slate-900/20"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components for cleaner code ---

function SectionHeader({ icon, title, noBorder }: { icon: React.ReactNode; title: string; noBorder?: boolean }) {
  return (
    <h3 className={`flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-slate-700 mb-5 ${!noBorder ? "border-b border-slate-100 pb-3" : ""}`}>
      {icon}
      {title}
    </h3>
  );
}

function IdentityCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const bgColors: Record<string, string> = {
    indigo: "bg-indigo-50/50 border-indigo-100 text-indigo-600",
    emerald: "bg-emerald-50/50 border-emerald-100 text-emerald-600",
    blue: "bg-blue-50/50 border-blue-100 text-blue-600",
  };

  const iconColors: Record<string, string> = {
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${bgColors[color]}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconColors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider mb-0.5">{label}</p>
        <p className="font-bold text-slate-800 text-sm">{value}</p>
      </div>
    </div>
  );
}

function GarbageItem({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    slate: "bg-slate-50 border-slate-200 text-slate-700",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    stone: "bg-stone-50 border-stone-200 text-stone-700",
  };

  return (
    <div className={`border rounded-xl p-3 ${colors[color]} flex flex-col justify-between h-20`}>
      <span className="text-[10px] uppercase font-bold opacity-70 mb-1">{label}</span>
      <p className="text-xl font-black">{value}<span className="text-[10px] font-semibold opacity-60 ml-0.5">kg</span></p>
    </div>
  );
}

function CompactStat({ label, value, bg = "bg-slate-50" }: { label: string; value: number; bg?: string }) {
  return (
    <div className={`${bg} rounded-lg p-2 text-center border border-black/5`}>
      <span className="text-[9px] font-bold text-slate-500 block mb-0.5">{label}</span>
      <span className="text-sm font-black text-slate-800 block">{value}</span>
    </div>
  );
}

function OtherItem({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1 shadow-sm h-full">
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-[10px] font-bold text-slate-500 leading-tight h-6 flex items-center">{label}</span>
      <span className="text-lg font-black text-slate-800 leading-none">{value}</span>
    </div>
  );
}

function CleanlinessStatus({ type, text }: { type: "sudah" | "belum"; text: string }) {
  const isSudah = type === "sudah";
  return (
    <div className={`relative pl-4 border-l-2 ${isSudah ? "border-emerald-500" : "border-amber-500"}`}>
      <p className={`text-xs font-bold uppercase mb-1.5 ${isSudah ? "text-emerald-600" : "text-amber-600"}`}>
        {isSudah ? "Sudah Dibersihkan" : "Belum Dibersihkan"}
      </p>
      <div className={`text-sm text-slate-700 p-3 rounded-lg border leading-relaxed ${isSudah ? "bg-emerald-50/30 border-emerald-100" : "bg-amber-50/30 border-amber-100"
        }`}>
        {text && text !== "-" ? text : <span className="text-slate-400 italic">Tidak ada catatan</span>}
      </div>
    </div>
  );
}
