"use client";

import React from "react";

interface SummaryItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: "indigo" | "emerald" | "orange" | "red" | "blue" | "purple";
}

interface SummaryCardsProps {
  items: SummaryItem[];
}

const colorMap = {
  indigo: {
    bg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    shadow: "shadow-indigo-500/20",
    light: "bg-indigo-400/30",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/20",
    light: "bg-emerald-400/30",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-400 to-orange-500",
    shadow: "shadow-orange-500/20",
    light: "bg-orange-300/30",
  },
  red: {
    bg: "bg-gradient-to-br from-red-500 to-rose-600",
    shadow: "shadow-red-500/20",
    light: "bg-red-400/30",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/20",
    light: "bg-blue-400/30",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-500 to-purple-600",
    shadow: "shadow-purple-500/20",
    light: "bg-purple-400/30",
  },
};

export default function SummaryCards({ items }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => {
        const scheme = colorMap[item.color];
        return (
          <div
            key={i}
            className={`${scheme.bg} rounded-2xl p-5 text-white shadow-lg ${scheme.shadow} relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
            <div className="relative">
              <div className={`w-10 h-10 ${scheme.light} rounded-xl flex items-center justify-center mb-3`}>
                {item.icon}
              </div>
              <span className="text-3xl font-black block">{item.value}</span>
              <span className="text-xs font-semibold uppercase tracking-wide mt-1 block opacity-80">
                {item.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
