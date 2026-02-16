"use client";

import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Warehouse, Loader2 } from "lucide-react";

const GUDANG_PASSWORD = "gudang2026";

export default function GudangGate({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const saved = sessionStorage.getItem("sikhaki_gudang_auth");
        if (saved === "true") {
            setAuthenticated(true);
        }
        setLoading(false);

        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted) {
                const stillAuth = sessionStorage.getItem("sikhaki_gudang_auth");
                if (stillAuth !== "true") {
                    setAuthenticated(false);
                }
            }
        };
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === GUDANG_PASSWORD) {
            setAuthenticated(true);
            sessionStorage.setItem("sikhaki_gudang_auth", "true");
            setError(false);
        } else {
            setError(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20" />
        );
    }

    if (authenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20">
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-950 to-orange-950 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 w-full max-w-sm shadow-2xl">
                <div className="text-center space-y-3 mb-8">
                    <div className="w-14 h-14 bg-amber-500/20 rounded-2xl mx-auto flex items-center justify-center">
                        <Warehouse size={28} className="text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Data Gudang</h2>
                        <p className="text-sm text-white/50 font-medium">Masukkan password untuk akses</p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(false); }}
                            placeholder="Password"
                            className={`w-full bg-white/10 border rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-white/30 font-semibold text-sm focus:outline-none focus:ring-2 transition-all ${error ? "border-red-400 focus:ring-red-400/50" : "border-white/10 focus:ring-amber-400/50"
                                }`}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs font-semibold text-center">Password salah. Coba lagi.</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/25"
                    >
                        Masuk
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-white/30 hover:text-white/60 text-xs font-semibold transition-colors">
                        ← Kembali ke Beranda
                    </a>
                </div>
            </div>
        </div>
    );
}
