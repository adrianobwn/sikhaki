"use client";

import React from "react";

interface CleanlinessData {
  sudahDibersihkan: string;
  belumDibersihkan: string;
}

interface CleanlinessSectionProps {
  data: CleanlinessData;
  onChange: (data: CleanlinessData) => void;
}

export default function CleanlinessSection({ data, onChange }: CleanlinessSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-teal-700">
          ✅ Area Sudah Dibersihkan
        </label>
        <textarea
          value={data.sudahDibersihkan}
          onChange={(e) => onChange({ ...data, sudahDibersihkan: e.target.value })}
          placeholder="Jelaskan area yang sudah dibersihkan..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none shadow-sm transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-red-600">
          ❌ Area Belum Dibersihkan
        </label>
        <textarea
          value={data.belumDibersihkan}
          onChange={(e) => onChange({ ...data, belumDibersihkan: e.target.value })}
          placeholder="Jelaskan area yang belum dibersihkan..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none shadow-sm transition-all"
        />
      </div>
    </div>
  );
}
