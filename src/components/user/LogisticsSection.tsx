"use client";

import React from "react";
import Stepper from "@/components/ui/Stepper";
import { Hand, ShoppingBag, Syringe, Package } from "lucide-react";

interface LogisticsData {
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
}

interface LogisticsSectionProps {
  data: LogisticsData;
  onChange: (data: LogisticsData) => void;
}

type LogisticsKey = keyof LogisticsData;


export default function LogisticsSection({ data, onChange }: LogisticsSectionProps) {
  const update = (key: LogisticsKey, val: number) => onChange({ ...data, [key]: val });

  const renderSizedPlastic = (
    label: string, 
    key40: LogisticsKey, key60: LogisticsKey, key90: LogisticsKey,
    theme: { bg: string, border: string, text: string, decoration: string },
    stepperColor: "slate" | "yellow"
  ) => (
    <div className={`border rounded-2xl p-4 ${theme.bg} ${theme.border} relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-20 h-20 ${theme.decoration} rounded-bl-full -mr-3 -mt-3 opacity-15`} />
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className={`p-2 rounded-xl bg-white shadow-sm ${theme.text}`}>
          <ShoppingBag size={18} />
        </div>
        <h4 className={`font-bold ${theme.text}`}>{label}</h4>
      </div>
      <div className="space-y-2 relative z-10 bg-white/60 p-3 rounded-xl">
        <Stepper label="Ukuran 90" unit="Lembar" value={data[key90]} onChange={(v) => update(key90, v)} color={stepperColor} />
        <div className="h-px bg-slate-200/50" />
        <Stepper label="Ukuran 60" unit="Lembar" value={data[key60]} onChange={(v) => update(key60, v)} color={stepperColor} />
        <div className="h-px bg-slate-200/50" />
        <Stepper label="Ukuran 40" unit="Lembar" value={data[key40]} onChange={(v) => update(key40, v)} color={stepperColor} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Plastik Kuning */}
      {renderSizedPlastic(
        'Plastik Kuning (Infeksius)',
        'plastikKuning40', 'plastikKuning60', 'plastikKuning90',
        { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', decoration: 'bg-yellow-500' },
        'yellow'
      )}

      {/* Plastik Hitam */}
      {renderSizedPlastic(
        'Plastik Hitam (Domestik)',
        'plastikHitam40', 'plastikHitam60', 'plastikHitam90',
        { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-800', decoration: 'bg-slate-900' },
        'slate'
      )}

      {/* Single Items */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-700 text-sm">Stok Lainnya</h3>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm space-y-1">
          {/* Plastik Ungu */}
          <div className="p-2">
            <Stepper
              label="Plastik Ungu"
              unit="Lembar"
              value={data.plastikUngu}
              onChange={(v) => update('plastikUngu', v)}
              color="purple"
              icon={<Package size={18} className="text-purple-600" />}
            />
          </div>
          <div className="h-px bg-slate-100 mx-4" />

          {/* Plastik Coklat */}
          <div className="p-2">
            <Stepper
              label="Plastik Coklat"
              unit="Lembar"
              value={data.plastikCoklat}
              onChange={(v) => update('plastikCoklat', v)}
              color="orange"
              icon={<Package size={18} className="text-amber-700" />}
            />
          </div>
          <div className="h-px bg-slate-100 mx-4" />

          {/* Safety Box */}
          <div className="p-2">
            <Stepper
              label="Safety Box"
              unit="Box"
              value={data.safetyBox}
              onChange={(v) => update('safetyBox', v)}
              color="orange"
              icon={<Syringe size={18} className="text-orange-600" />}
            />
          </div>
          <div className="h-px bg-slate-100 mx-4" />

          {/* Hand Towel */}
          <div className="p-2">
            <Stepper
              label="Hand Towel"
              unit="Pack"
              value={data.handTowel}
              onChange={(v) => update('handTowel', v)}
              color="blue"
              icon={<Hand size={18} className="text-blue-600" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
