"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("sikhaki_admin_auth");
    if (saved === "true") {
      setAuthenticated(true);
    }
    setLoading(false);

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        const stillAuth = sessionStorage.getItem("sikhaki_admin_auth");
        if (stillAuth !== "true") {
          setAuthenticated(false);
        }
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, role: "admin" }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAuthenticated(true);
        sessionStorage.setItem("sikhaki_admin_auth", "true");
      } else {
        setError(data.error || "Password salah. Hubungi supervisor untuk akses.");
        setPassword("");
      }
    } catch {
      setError("Gagal menghubungi server. Coba lagi.");
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20" />
    );
  }

  if (authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 relative mx-auto mb-4 opacity-80">
            <Image
              src="/Logo-RSUI.png"
              alt="Logo RSUI"
              fill
              sizes="64px"
              className="object-contain brightness-0 invert"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-indigo-300 text-sm mt-1">SIKHAKI — Akses Terbatas</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <Lock size={24} className="text-indigo-300" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">Masukkan Password</h2>
            <p className="text-sm text-indigo-200/70 mt-1">Area ini hanya untuk admin & supervisor</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 p-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password admin..."
              autoFocus
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 px-4 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-lg tracking-widest"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!password || loginLoading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/30 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/30"
          >
            {loginLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Memverifikasi...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Masuk Dashboard
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-indigo-300/40 mt-6">
          © 2026 SIKHAKI — RSUI
        </p>
      </div>
    </div>
  );
}
