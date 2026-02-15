import { createClient } from '@supabase/supabase-js';

// Pastikan environment variables sudah di-set di .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const { data: result, error } = await supabase
    .from('laporan')
    .insert([data])
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting laporan:', error);
    throw error;
  }
  
  return result;
}

/**
 * Fetch laporan dengan filter
 */
export async function fetchLaporan(filters?: {
  tanggal?: string;
  shift?: string;
  area?: string;
  petugas?: string;
}) {
  let query = supabase
    .from('laporan')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (filters?.tanggal) {
    query = query.eq('tanggal', filters.tanggal);
  }
  
  if (filters?.shift) {
    query = query.eq('shift', filters.shift);
  }
  
  if (filters?.area) {
    query = query.eq('area_id', parseInt(filters.area));
  }
  
  if (filters?.petugas) {
    query = query.ilike('petugas', `%${filters.petugas}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching laporan:', error);
    throw error;
  }
  
  return data as LaporanRow[];
}

/**
 * Get statistik dashboard
 */
export async function getDashboardStats(tanggal: string) {
  const { data, error } = await supabase
    .from('laporan')
    .select('*')
    .eq('tanggal', tanggal);
  
  if (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
  
  const totalLaporan = data.length;
  const areaSelesai = data.filter((r) => r.status === 'selesai').length;
  const totalSampah = data.reduce(
    (sum, r) =>
      sum +
      r.sampah_infeksius +
      r.sampah_anorganik +
      r.sampah_safety_box +
      r.sampah_kardus,
    0
  );
  const totalKendala = data.filter((r) => r.kendala).length;
  
  return {
    totalLaporan,
    areaSelesai,
    totalSampah: parseFloat(totalSampah.toFixed(1)),
    totalKendala,
  };
}

/**
 * Get data untuk chart activity per shift
 */
export async function getActivityChartData(tanggal: string) {
  const { data, error } = await supabase
    .from('laporan')
    .select('shift, status')
    .eq('tanggal', tanggal);
  
  if (error) {
    console.error('Error fetching activity chart:', error);
    return [];
  }
  
  // Group by shift
  const groupedByShift: Record<string, { laporan: number; selesai: number }> = {};
  
  data.forEach((item) => {
    if (!groupedByShift[item.shift]) {
      groupedByShift[item.shift] = { laporan: 0, selesai: 0 };
    }
    groupedByShift[item.shift].laporan += 1;
    if (item.status === 'selesai') {
      groupedByShift[item.shift].selesai += 1;
    }
  });
  
  return Object.entries(groupedByShift).map(([shift, counts]) => ({
    shift,
    ...counts,
  }));
}

/**
 * Get data untuk pie chart komposisi sampah
 */
export async function getGarbagePieData(tanggal: string) {
  const { data, error } = await supabase
    .from('laporan')
    .select('sampah_infeksius, sampah_anorganik, sampah_safety_box, sampah_kardus')
    .eq('tanggal', tanggal);
  
  if (error) {
    console.error('Error fetching garbage pie:', error);
    return {
      infeksius: 0,
      anorganik: 0,
      safetyBox: 0,
      kardus: 0,
    };
  }
  
  const aggregate = data.reduce(
    (acc, row) => ({
      infeksius: acc.infeksius + row.sampah_infeksius,
      anorganik: acc.anorganik + row.sampah_anorganik,
      safetyBox: acc.safetyBox + row.sampah_safety_box,
      kardus: acc.kardus + row.sampah_kardus,
    }),
    { infeksius: 0, anorganik: 0, safetyBox: 0, kardus: 0 }
  );
  
  return {
    infeksius: parseFloat(aggregate.infeksius.toFixed(1)),
    anorganik: parseFloat(aggregate.anorganik.toFixed(1)),
    safetyBox: parseFloat(aggregate.safetyBox.toFixed(1)),
    kardus: parseFloat(aggregate.kardus.toFixed(1)),
  };
}
