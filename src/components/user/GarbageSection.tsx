"use client";

import React from "react";
import Stepper from "@/components/ui/Stepper";
import { Biohazard, Trash2, Box, Archive, Syringe } from "lucide-react";

interface GarbageData {
  infeksius: number;
  anorganik: number;
  safetyBox: number;
  kardus: number;
}

interface GarbageSectionProps {
  data: GarbageData;
  onChange: (data: GarbageData) => void;
}

type GarbageKey = 'infeksius' | 'anorganik' | 'safetyBox' | 'kardus';

export default function GarbageSection({ data, onChange }: GarbageSectionProps) {
  const update = (key: GarbageKey, val: number) => onChange({ ...data, [key]: val });
  
  return (
    <div className="space-y-4">
      {/* Limbah Infeksius (Kuning) */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-bl-full -mr-4 -mt-4 opacity-50" />
        
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center shadow-sm">
            <Biohazard size={24} />
          </div>
          <div>
            <h3 className="font-bold text-yellow-900 leading-tight">Limbah Infeksius</h3>
            <p className="text-xs font-medium text-yellow-700">Plastik Kuning</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/50 p-2 rounded-xl border border-yellow-200 backdrop-blur-sm">
           <span className="text-sm font-bold text-yellow-900 w-24 pl-2">Berat (kg)</span>
           <input 
              type="number" 
              inputMode="decimal"
              step="0.1"
              value={data.infeksius || ''}
              onChange={(e) => update('infeksius', parseFloat(e.target.value) || 0)}
              placeholder="0.0"
              className="flex-1 bg-white border border-yellow-300 rounded-lg py-2 px-3 text-right font-bold text-yellow-900 placeholder:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
           />
           <span className="text-xs font-semibold text-yellow-700 w-8">Kg</span>
        </div>
      </div>

      {/* Limbah Domestik (Hitam) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200 rounded-bl-full -mr-4 -mt-4 opacity-30" />
        
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center shadow-sm">
            <Trash2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">Limbah Domestik</h3>
            <p className="text-xs font-medium text-slate-600">Plastik Hitam</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/50 p-2 rounded-xl border border-slate-200 backdrop-blur-sm">
           <span className="text-sm font-bold text-slate-900 w-24 pl-2">Berat (kg)</span>
           <input 
              type="number" 
              inputMode="decimal"
              step="0.1"
              value={data.anorganik || ''}
              onChange={(e) => update('anorganik', parseFloat(e.target.value) || 0)}
              placeholder="0.0"
              className="flex-1 bg-white border border-slate-300 rounded-lg py-2 px-3 text-right font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
           />
           <span className="text-xs font-semibold text-slate-700 w-8">Kg</span>
        </div>
      </div>

      {/* Safety Box (Tajam) */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-bl-full -mr-4 -mt-4 opacity-50" />
        
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
            <Syringe size={24} />
          </div>
          <div>
            <h3 className="font-bold text-orange-900 leading-tight">Safety Box</h3>
            <p className="text-xs font-medium text-orange-700">Limbah Tajam/Jarum</p>
          </div>
        </div>

        <Stepper
          label="Jumlah"
          unit="Box Penuh"
          value={data.safetyBox}
          onChange={(v) => update('safetyBox', v)}
          color="orange"
        />
      </div>

      {/* Kardus */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-stone-200 text-stone-600 flex items-center justify-center shadow-sm">
            <Archive size={24} />
          </div>
          <div>
            <h3 className="font-bold text-stone-800 leading-tight">Limbah Kardus</h3>
            <p className="text-xs font-medium text-stone-600">Dilipat & Diikat</p>
          </div>
        </div>

        <Stepper
          label="Jumlah"
          unit="Ikat"
          value={data.kardus}
          onChange={(v) => update('kardus', v)}
          color="slate"
        />
      </div>
    </div>
  );
}
