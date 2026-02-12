import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lapor — SIKHAKI",
  description: "Form laporan harian petugas SIKHAKI",
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50/20">
      {children}
    </div>
  );
}
