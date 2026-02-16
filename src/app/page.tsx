"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { ClipboardList, LayoutDashboard, Warehouse, ArrowRight } from "lucide-react";

// Clear auth whenever user lands on homepage
function ClearAuth() {
  useEffect(() => {
    sessionStorage.removeItem("sikhaki_admin_auth");
    sessionStorage.removeItem("sikhaki_gudang_auth");
  }, []);
  return null;
}

const cards = [
  {
    title: "Form Laporan",
    desc: "Untuk petugas lapangan",
    href: "/lapor",
    icon: ClipboardList,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/25",
  },
  {
    title: "Dashboard Admin",
    desc: "Monitoring & data",
    href: "/dashboard",
    icon: LayoutDashboard,
    gradient: "from-indigo-500 to-purple-600",
    shadow: "shadow-indigo-500/25",
  },
  {
    title: "Data Gudang",
    desc: "Keluar masuk barang & grafik",
    href: "/gudang",
    icon: Warehouse,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/25",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center p-4">
      <ClearAuth />
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo & Title */}
        <div className="space-y-3">
          <div className="w-16 h-16 relative mx-auto">
            <Image
              src="/Logo-RSUI.png"
              alt="Logo RSUI"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">SIKHAKI</h1>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mt-1">
              Resource Management System
            </p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="space-y-3">
          {cards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className={`block rounded-2xl bg-gradient-to-r ${card.gradient} p-4 text-left text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${card.shadow}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <card.icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">{card.title}</h2>
                    <p className="text-xs text-white/80 font-medium">{card.desc}</p>
                  </div>
                </div>
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight size={16} />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          © 2026 RSUI — SIKHAKI
        </p>
      </div>
    </div>
  );
}
