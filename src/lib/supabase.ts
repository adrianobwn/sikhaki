/**
 * Client-side API Layer for SIKHAKI
 *
 * File ini di-import oleh komponen client ("use client").
 * Semua fungsi memanggil API routes via fetch() — tidak langsung akses database.
 *
 * Mendukung dua backend tanpa perubahan di sisi client:
 * - VPS (PostgreSQL) — API route pakai pg
 * - Vercel (Supabase) — API route pakai Supabase SDK
 */

// ============================================
// TYPE DEFINITIONS (tidak berubah)
// ============================================

export interface LaporanInsert {
  waktu: string;
  tanggal: string;
  petugas: string;
  area_id: number;
  area_nama: string;
  shift: string;
  sudah_dibersihkan: string;
  belum_dibersihkan: string;
  sampah_infeksius: number;
  sampah_anorganik: number;
  sampah_safety_box: number;
  sampah_kardus: number;
  logistik_kuning_90: number;
  logistik_kuning_60: number;
  logistik_kuning_40: number;
  logistik_hitam_90: number;
  logistik_hitam_60: number;
  logistik_hitam_40: number;
  logistik_ungu: number;
  logistik_coklat: number;
  logistik_safety_box: number;
  logistik_hand_towel: number;
  kendala?: string;
  foto_url?: string;
}

export interface LaporanRow {
  id: string;
  created_at: string;
  waktu: string;
  tanggal: string;
  petugas: string;
  area_id: number;
  area_nama: string;
  shift: string;
  sudah_dibersihkan: string;
  belum_dibersihkan: string;
  sampah_infeksius: number;
  sampah_anorganik: number;
  sampah_safety_box: number;
  sampah_kardus: number;
  logistik_kuning_90: number;
  logistik_kuning_60: number;
  logistik_kuning_40: number;
  logistik_hitam_90: number;
  logistik_hitam_60: number;
  logistik_hitam_40: number;
  logistik_ungu: number;
  logistik_coklat: number;
  logistik_safety_box: number;
  logistik_hand_towel: number;
  kendala: string | null;
  foto_url: string | null;
  status: 'selesai' | 'kendala';
}

// ============================================
// STOK BARANG — TYPES
// ============================================

export interface StokBarangRow {
  id: string;
  created_at: string;
  nama_barang: string;
  stok_awal: number;
  pengambilan: number;
  tanggal: string;
  satuan: string | null;
  keterangan: string | null;
}

export interface StokBarangInsert {
  nama_barang: string;
  stok_awal: number;
  pengambilan: number;
  tanggal: string;
  satuan?: string;
  keterangan?: string;
}

export interface StokTimeSeriesItem {
  nama_barang: string;
  satuan: string;
  data: { tanggal: string; pengambilan: number }[];
}

// ============================================
// CLIENT-SIDE API FUNCTIONS
// Semua memanggil API routes via fetch()
// ============================================

/**
 * Upload foto — sekarang ditangani langsung oleh /api/laporan saat submit.
 * Fungsi ini dipertahankan untuk backward compatibility.
 */
export async function uploadFoto(_base64Data: string, _fileName?: string): Promise<string | null> {
  // Upload foto sekarang dilakukan server-side di /api/laporan
  return null;
}

/**
 * Insert laporan baru via API route
 */
export async function insertLaporan(data: LaporanInsert) {
  const res = await fetch('/api/laporan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Gagal menyimpan laporan');
  }
  return (await res.json()).data;
}

/**
 * Bundled dashboard data via API route
 */
export async function getDashboardBundle(filters: {
  tanggal: string;
  shift?: string;
  area?: string;
  petugas?: string;
}) {
  const params = new URLSearchParams();
  if (filters.tanggal) params.set('tanggal', filters.tanggal);
  if (filters.shift) params.set('shift', filters.shift);
  if (filters.area) params.set('area', filters.area);
  if (filters.petugas) params.set('petugas', filters.petugas);

  const res = await fetch(`/api/dashboard?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Gagal mengambil data dashboard');
  }
  return (await res.json()) as {
    rows: LaporanRow[];
    stats: { totalLaporan: number; areaSelesai: number; totalSampah: number; totalKendala: number };
    chartData: { shift: string; laporan: number; selesai: number; kendala: number }[];
    garbage: { infeksius: number; anorganik: number; safetyBox: number; kardus: number };
  };
}

/**
 * Insert record stok barang baru
 */
export async function insertStokBarang(data: StokBarangInsert) {
  const res = await fetch('/api/stok-barang', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Gagal menyimpan stok barang');
  }
  return (await res.json()) as StokBarangRow;
}

/**
 * Fetch data stok barang, optional filter by tanggal
 */
export async function fetchStokBarang(tanggal?: string) {
  const params = new URLSearchParams();
  if (tanggal) params.set('tanggal', tanggal);

  const res = await fetch(`/api/stok-barang?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Gagal mengambil data stok');
  }
  return (await res.json()) as StokBarangRow[];
}

/**
 * Update record stok barang
 */
export async function updateStokBarang(id: string, data: Partial<StokBarangInsert>) {
  const res = await fetch(`/api/stok-barang/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Gagal update stok barang');
  }
  return (await res.json()) as StokBarangRow;
}

/**
 * Delete record stok barang
 */
export async function deleteStokBarang(id: string) {
  const res = await fetch(`/api/stok-barang/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Gagal hapus stok barang');
  }
}

/**
 * Get time-series stok per nama barang (untuk grafik dashboard)
 */
export async function getStokTimeSeries(): Promise<StokTimeSeriesItem[]> {
  const res = await fetch('/api/stok-barang/time-series');
  if (!res.ok) return [];
  return (await res.json()) as StokTimeSeriesItem[];
}
