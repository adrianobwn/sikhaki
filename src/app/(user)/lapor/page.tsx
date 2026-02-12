"use client";

import React, { useState } from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import IdentitySection from "@/components/user/IdentitySection";
import CleanlinessSection from "@/components/user/CleanlinessSection";
import GarbageSection from "@/components/user/GarbageSection";
import LogisticsSection from "@/components/user/LogisticsSection";
import CameraModule from "@/components/user/CameraModule";
import { User, Sparkles, Trash2, Package, CheckCircle2, AlertCircle, Camera } from "lucide-react";

interface FormData {
  identity: { nama: string; area: string; shift: string };
  cleanliness: { sudahDibersihkan: string; belumDibersihkan: string };
  garbage: { infeksius: number; anorganik: number; safetyBox: number; kardus: number };
  logistics: { 
    plastikKuning90: number; plastikKuning60: number; plastikKuning40: number;
    plastikHitam90: number; plastikHitam60: number; plastikHitam40: number;
    plastikUngu: number;
    plastikCoklat: number;
    safetyBox: number;
    handTowel: number;
  };
  validation: { kendala: string; foto: string | null };
}

const initialForm: FormData = {
  identity: { nama: "", area: "", shift: "" },
  cleanliness: { sudahDibersihkan: "", belumDibersihkan: "" },
  garbage: { infeksius: 0, anorganik: 0, safetyBox: 0, kardus: 0 },
  logistics: { 
    plastikKuning90: 0, plastikKuning60: 0, plastikKuning40: 0,
    plastikHitam90: 0, plastikHitam60: 0, plastikHitam40: 0,
    plastikUngu: 0, plastikCoklat: 0, safetyBox: 0, handTowel: 0,
  },
  validation: { kendala: "", foto: null },
};

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

export default function LaporPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = !!form.validation.foto && !!form.identity.nama && !!form.identity.area && !!form.identity.shift;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    console.log("Submitted:", form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-sm w-full space-y-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Laporan Berhasil</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Terima kasih <strong>{form.identity.nama}</strong>. Data laporan operasional telah tersimpan di sistem.
            </p>
          </div>
          <Button
            onClick={() => {
              setForm({ ...initialForm, identity: { ...initialForm.identity, nama: form.identity.nama } });
              setSubmitted(false);
            }}
            fullWidth
            variant="primary"
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            Buat Laporan Baru
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Professional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image 
                src="/Logo-RSUI.png" 
                alt="Logo RSUI" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">SIKHAKI</h1>
              <p className="text-[10px] uppercase font-medium text-slate-500 tracking-wide">Laporan Harian</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tanggal</div>
            <div className="text-xs font-bold text-slate-700">{getFormattedDate()}</div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 mt-2">
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Section 1: Identitas */}
          <Card 
            title="Identitas Petugas" 
            icon={<User size={18} />}
          >
            <IdentitySection
              data={form.identity}
              onChange={(identity) => setForm({ ...form, identity })}
            />
          </Card>

          {/* Section 2: Kebersihan */}
          <Card 
            title="Laporan Kebersihan" 
            icon={<Sparkles size={18} />}
          >
            <CleanlinessSection
              data={form.cleanliness}
              onChange={(cleanliness) => setForm({ ...form, cleanliness })}
            />
          </Card>

          {/* Section 3: Sampah */}
          <Card 
            title="Volume Sampah (kg)" 
            icon={<Trash2 size={18} />}
          >
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-4 flex gap-3 text-orange-800">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">Pastikan menimbang sampah dengan akurat sebelum input data.</p>
            </div>
            <GarbageSection
              data={form.garbage}
              onChange={(garbage) => setForm({ ...form, garbage })}
            />
          </Card>

          {/* Section 4: Logistik */}
          <Card 
            title="Stok Logistik" 
            icon={<Package size={18} />}
          >
            <LogisticsSection
              data={form.logistics}
              onChange={(logistics) => setForm({ ...form, logistics })}
            />
          </Card>

          {/* Section 5: Absen Pulang */}
          <Card 
            title="Absen Pulang (Selfie)" 
            icon={<Camera size={18} />}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2 text-slate-500">
                  Kendala / Catatan
                </label>
                <textarea
                  value={form.validation.kendala}
                  onChange={(e) =>
                    setForm({ ...form, validation: { ...form.validation, kendala: e.target.value } })
                  }
                  placeholder="Ada kendala di lapangan?"
                  rows={3}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                />
              </div>

              <CameraModule
                photo={form.validation.foto}
                onCapture={(foto) =>
                  setForm({ ...form, validation: { ...form.validation, foto: foto || null } })
                }
              />
            </div>
          </Card>
        </form>
      </main>

      {/* Floating Submit Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-40 safe-area-pb">
        <div className="max-w-md mx-auto">
          <Button 
            type="submit" 
            fullWidth 
            disabled={!canSubmit} 
            className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 py-3.5 text-base"
            onClick={handleSubmit} 
          >
            {canSubmit ? "Kirim Laporan" : "Lengkapi Data & Foto"}
          </Button>
        </div>
      </div>
    </div>
  );
}
