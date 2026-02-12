import type { Metadata } from "next";
import AdminGate from "@/components/admin/AdminGate";

export const metadata: Metadata = {
  title: "Dashboard Admin — SIKHAKI",
  description: "Dashboard monitoring laporan harian SIKHAKI",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      {children}
    </AdminGate>
  );
}
