import { createClient } from '@supabase/supabase-js';
import { safeQuery } from './error-handler';

// Environment variables — tersedia saat runtime (Vercel/local), mungkin kosong saat build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables belum di-set. Database tidak akan berfungsi.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

// ============================================
// TYPE DEFINITIONS
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
// DATABASE OPERATIONS
// ============================================

/**
 * Upload foto ke Supabase Storage
 * @param base64Data - Base64 data URL dari kamera
 * @param fileName - Nama file (otomatis generate jika tidak ada)
 * @returns Public URL foto atau null jika gagal
 */
export async function uploadFoto(base64Data: string, fileName?: string): Promise<string | null> {
  try {
    // Convert base64 to Blob
    const base64Response = await fetch(base64Data);
    const blob = await base64Response.blob();

    // Generate unique filename
    const timestamp = Date.now();
    const finalFileName = fileName || `absen-${timestamp}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('foto-absen')
      .upload(finalFileName, blob, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading foto:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('foto-absen')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadFoto:', error);
    return null;
  }
}

/**
 * Insert laporan baru ke database
 */
export async function insertLaporan(data: LaporanInsert) {
  const result = await safeQuery(
    () => supabase.from('laporan').insert([data]).select().single(),
    'insertLaporan'
  );
  return result;
}

/**
 * Bundled dashboard data — menggabungkan 4 query terpisah menjadi 1.
 * Mengurangi round-trip ke database dari 4x menjadi 1x.
 */
export async function getDashboardBundle(filters: {
  tanggal: string;
  shift?: string;
  area?: string;
  petugas?: string;
}) {
  let query = supabase
    .from('laporan')
    .select('id, waktu, tanggal, petugas, area_id, area_nama, shift, status, kendala, foto_url, sudah_dibersihkan, belum_dibersihkan, sampah_infeksius, sampah_anorganik, sampah_safety_box, sampah_kardus, logistik_kuning_90, logistik_kuning_60, logistik_kuning_40, logistik_hitam_90, logistik_hitam_60, logistik_hitam_40, logistik_ungu, logistik_coklat, logistik_safety_box, logistik_hand_towel, created_at')
    .eq('tanggal', filters.tanggal)
    .order('created_at', { ascending: false });

  if (filters.shift) query = query.eq('shift', filters.shift);
  if (filters.area) query = query.eq('area_id', parseInt(filters.area));
  if (filters.petugas) query = query.ilike('petugas', `%${filters.petugas}%`);

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching dashboard bundle:', error);
    throw error;
  }

  const rows = data as LaporanRow[];

  // Stats — dihitung dari dataset yang sama
  const stats = {
    totalLaporan: rows.length,
    areaSelesai: rows.filter((r) => r.status === 'selesai').length,
    totalSampah: parseFloat(
      rows
        .reduce(
          (s, r) =>
            s +
            Number(r.sampah_infeksius) +
            Number(r.sampah_anorganik) +
            Number(r.sampah_safety_box) +
            Number(r.sampah_kardus),
          0
        )
        .toFixed(1)
    ),
    totalKendala: rows.filter((r) => r.kendala).length,
  };

  // Chart data — group by shift
  const shiftMap: Record<string, { laporan: number; selesai: number; kendala: number }> = {};
  rows.forEach((r) => {
    if (!shiftMap[r.shift]) shiftMap[r.shift] = { laporan: 0, selesai: 0, kendala: 0 };
    shiftMap[r.shift].laporan++;
    if (r.status === 'selesai') shiftMap[r.shift].selesai++;
    else if (r.status === 'kendala') shiftMap[r.shift].kendala++;
  });
  const chartData = Object.entries(shiftMap).map(([shift, c]) => ({ shift, ...c }));

  // Garbage pie — aggregate sampah
  const garbage = {
    infeksius: parseFloat(rows.reduce((s, r) => s + Number(r.sampah_infeksius), 0).toFixed(1)),
    anorganik: parseFloat(rows.reduce((s, r) => s + Number(r.sampah_anorganik), 0).toFixed(1)),
    safetyBox: parseFloat(rows.reduce((s, r) => s + Number(r.sampah_safety_box), 0).toFixed(1)),
    kardus: parseFloat(rows.reduce((s, r) => s + Number(r.sampah_kardus), 0).toFixed(1)),
  };

  return { rows, stats, chartData, garbage };
}

// ============================================
// STOK BARANG — TYPES & OPERATIONS
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

/**
 * Insert record stok barang baru
 */
export async function insertStokBarang(data: StokBarangInsert) {
  const result = await safeQuery(
    () => supabase.from('stok_barang').insert([data]).select().single(),
    'insertStokBarang'
  );
  return result;
}

/**
 * Fetch data stok barang, optional filter by tanggal
 */
export async function fetchStokBarang(tanggal?: string) {
  let query = supabase
    .from('stok_barang')
    .select('*')
    .order('nama_barang', { ascending: true })
    .order('tanggal', { ascending: false });

  if (tanggal) {
    query = query.eq('tanggal', tanggal);
  }

  const result = await safeQuery<StokBarangRow[]>(
    () => query,
    'fetchStokBarang'
  );
  return result;
}

/**
 * Update record stok barang
 */
export async function updateStokBarang(id: string, data: Partial<StokBarangInsert>) {
  const result = await safeQuery(
    () => supabase.from('stok_barang').update(data).eq('id', id).select().single(),
    'updateStokBarang'
  );
  return result;
}

/**
 * Delete record stok barang
 */
export async function deleteStokBarang(id: string) {
  await safeQuery(
    () => supabase.from('stok_barang').delete().eq('id', id).select(),
    'deleteStokBarang'
  );
}

/**
 * Get time-series stok per nama barang (untuk grafik dashboard).
 * Mengembalikan array per barang, masing-masing berisi array data per tanggal.
 */
export interface StokTimeSeriesItem {
  nama_barang: string;
  satuan: string;
  data: { tanggal: string; pengambilan: number }[];
}

export async function getStokTimeSeries(): Promise<StokTimeSeriesItem[]> {
  const { data, error } = await supabase
    .from('stok_barang')
    .select('nama_barang, satuan, tanggal, pengambilan')
    .order('tanggal', { ascending: true });

  if (error) {
    console.error('Error fetching stok time series:', error);
    return [];
  }

  const rows = data as { nama_barang: string; satuan: string | null; tanggal: string; pengambilan: number }[];

  // Group by nama_barang
  const grouped: Record<string, { satuan: string; data: { tanggal: string; pengambilan: number }[] }> = {};

  rows.forEach((row) => {
    if (!grouped[row.nama_barang]) {
      grouped[row.nama_barang] = {
        satuan: row.satuan || '',
        data: []
      };
    }
    grouped[row.nama_barang].data.push({
      tanggal: row.tanggal,
      pengambilan: row.pengambilan,
    });
  });

  return Object.entries(grouped).map(([nama, content]) => ({
    nama_barang: nama,
    satuan: content.satuan,
    data: content.data,
  }));
}
