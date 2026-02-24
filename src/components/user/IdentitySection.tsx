"use client";

import React, { useEffect, useState } from "react";
import { AREAS, SHIFTS } from "@/constants/areas";

interface IdentityData {
  nama: string;
  area: string;
  shift: string;
}

interface IdentitySectionProps {
  data: IdentityData;
  onChange: (data: IdentityData) => void;
}

export default function IdentitySection({ data, onChange }: IdentitySectionProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      const savedName = localStorage.getItem("cso_nama") || "";
      if (savedName && !data.nama) {
        onChange({ ...data, nama: savedName });
      }
      setLoaded(true);
    }
  }, [loaded, data, onChange]);

  const handleNameChange = (nama: string) => {
    localStorage.setItem("cso_nama", nama);
    onChange({ ...data, nama });
  };

  return (
    <div className="space-y-3">
      {/* Nama */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-gray-500">
          Nama Petugas
        </label>
        <input
          type="text"
          value={data.nama}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Masukkan nama..."
          className="w-full border border-gray-300 rounded-xl p-3.5 text-base font-semibold bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* Area */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-gray-500">
          Area Kerja
        </label>
        <div className="relative">
          <select
            value={data.area}
            onChange={(e) => onChange({ ...data, area: e.target.value })}
            className="w-full border border-gray-300 rounded-xl p-3.5 text-base font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all shadow-sm"
          >
            <option value="">-- Pilih Area --</option>
            {AREAS.map((a) => (
              <option key={a.id} value={String(a.id)}>
                {a.id}. {a.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
            ▼
          </div>
        </div>
      </div>

      {/* Shift */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-gray-500">
          Shift
        </label>
        <div className="relative">
          <select
            value={data.shift}
            onChange={(e) => onChange({ ...data, shift: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all shadow-sm"
          >
            <option value="">-- Pilih Shift --</option>
            {SHIFTS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} — {s.name} ({s.jam})
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
            ▼
          </div>
        </div>
      </div>
    </div>
  );
}
