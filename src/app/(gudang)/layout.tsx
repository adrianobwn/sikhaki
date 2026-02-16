import type { Metadata } from "next";
import GudangGate from "@/components/gudang/GudangGate";

export const metadata: Metadata = {
    title: "Data Gudang — SIKHAKI",
    description: "Keluar masuk barang dan grafik stok gudang",
};

export default function GudangLayout({ children }: { children: React.ReactNode }) {
    return <GudangGate>{children}</GudangGate>;
}
