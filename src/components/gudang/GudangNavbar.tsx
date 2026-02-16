"use client";

import React from "react";
import Image from "next/image";
import { LogOut, LucideIcon } from "lucide-react";

interface NavAction {
    label: string;
    href: string;
    icon: LucideIcon;
}

interface GudangNavbarProps {
    title: string;
    subtitle: string;
    action?: NavAction;
}

export default function GudangNavbar({ title, subtitle, action }: GudangNavbarProps) {
    const handleLogout = () => {
        sessionStorage.removeItem("sikhaki_gudang_auth");
        window.location.replace("/");
    };

    return (
        <header className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 shadow-lg shadow-amber-500/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 relative bg-white rounded-xl p-1 shadow-sm">
                        <Image
                            src="/Logo-RSUI.png"
                            alt="Logo RSUI"
                            fill
                            sizes="40px"
                            className="object-contain p-0.5"
                            priority
                        />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white leading-tight">{title}</h1>
                        <p className="text-xs font-medium text-amber-200">{subtitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-white hidden md:block">
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>

                    {action && (
                        <a
                            href={action.href}
                            className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-xl transition-colors text-sm font-semibold"
                        >
                            <action.icon size={16} />
                            <span className="hidden sm:inline">{action.label}</span>
                        </a>
                    )}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-white hover:bg-red-500/30 rounded-xl transition-colors text-sm font-semibold"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Keluar</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
