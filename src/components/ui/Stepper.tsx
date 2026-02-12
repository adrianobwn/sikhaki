"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

interface StepperProps {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
  color?: "slate" | "red" | "yellow" | "green" | "blue" | "orange" | "purple";
}

export default function Stepper({
  label,
  unit,
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  icon,
  color = "slate",
}: StepperProps) {
  const decrement = () => {
    const next = Math.max(min, value - step);
    onChange(next);
  };

  const increment = () => {
    const next = Math.min(max, value + step);
    onChange(next);
  };

  const colorStyles = {
    slate: "bg-white border-slate-200 text-slate-800 ring-slate-200",
    red: "bg-red-50 border-red-200 text-red-900 ring-red-200",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900 ring-yellow-200",
    green: "bg-emerald-50 border-emerald-200 text-emerald-900 ring-emerald-200",
    blue: "bg-blue-50 border-blue-200 text-blue-900 ring-blue-200",
    orange: "bg-orange-50 border-orange-200 text-orange-900 ring-orange-200",
    purple: "bg-purple-50 border-purple-200 text-purple-900 ring-purple-200",
  };

  const buttonStyles = {
    slate: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    red: "bg-red-200 text-red-700 hover:bg-red-300",
    yellow: "bg-yellow-200 text-yellow-700 hover:bg-yellow-300",
    green: "bg-emerald-200 text-emerald-700 hover:bg-emerald-300",
    blue: "bg-blue-200 text-blue-700 hover:bg-blue-300",
    orange: "bg-orange-200 text-orange-700 hover:bg-orange-300",
    purple: "bg-purple-200 text-purple-700 hover:bg-purple-300",
  };

  return (
    <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all shadow-sm ${colorStyles[color]}`}>
      <div className="flex items-center gap-3 flex-1 pr-4">
        {icon && (
            <div className={`p-2 rounded-lg ${buttonStyles[color]} bg-opacity-50`}>
                {icon}
            </div>
        )}
        <div>
            <span className={`block text-sm font-bold ${color === 'slate' ? 'text-slate-800' : ''}`}>{label}</span>
            <span className={`text-xs font-medium opacity-70`}>{unit}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonStyles[color]}`}
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>
        <div className="w-8 text-center font-bold text-lg tabular-nums">
          {value}
        </div>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white hover:bg-gray-800`}
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
