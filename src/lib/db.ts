/**
 * Server-side Database Layer for SIKHAKI
 *
 * Dual backend:
 * - PostgreSQL via `pg` ketika DATABASE_URL di-set (VPS)
 * - Supabase via SDK ketika NEXT_PUBLIC_SUPABASE_URL di-set (Vercel)
 *
 * File ini HANYA boleh di-import dari API routes (server-side).
 */

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import type {
  LaporanInsert,
  LaporanRow,
  StokBarangRow,
  StokBarangInsert,
  StokTimeSeriesItem,
} from './supabase';

// ============================================
// CONNECTION MANAGEMENT
// ============================================

const USE_PG = !!process.env.DATABASE_URL;

// --- PostgreSQL (lazy init) ---
let _pool: InstanceType<typeof import('pg').Pool> | null = null;

async function getPool() {
  if (_pool) return _pool;
  const pg = await import('pg');
  const Pool = pg.default?.Pool ?? pg.Pool;

  // Parse NUMERIC → float, TIMESTAMPTZ → ISO string
  const types = pg.default?.types ?? pg.types;
  types.setTypeParser(1700, parseFloat);                             // NUMERIC
  types.setTypeParser(1184, (v: string) => new Date(v).toISOString()); // TIMESTAMPTZ

  _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return _pool;
}

// --- Supabase (lazy init) ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _supabase: any = null;

async function getSupabase() {
  if (_supabase) return _supabase;
  const { createClient } = await import('@supabase/supabase-js');
  _supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return _supabase;
}

// ============================================
// UPLOAD FOTO
// ============================================

export async function dbUploadFoto(
  base64Data: string,
  fileName?: string,
): Promise<string | null> {
  const timestamp = Date.now();
  const finalFileName = fileName || `absen-${timestamp}.jpg`;

  if (USE_PG) {
    // Simpan file secara lokal di VPS
    const uploadDir =
      process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');
    await writeFile(path.join(uploadDir, finalFileName), buffer);

    return `/uploads/${finalFileName}`;
  } else {
    // Supabase Storage
    const supabase = await getSupabase();
    const base64Response = await fetch(base64Data);
    const blob = await base64Response.blob();

    const { data, error } = await supabase.storage
      .from('foto-absen')
      .upload(finalFileName, blob, { contentType: 'image/jpeg', upsert: false });

    if (error) {
      console.error('Error uploading foto:', error);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('foto-absen').getPublicUrl(data.path);

    return publicUrl;
  }
}

// ============================================
// INSERT LAPORAN
// ============================================

export async function dbInsertLaporan(data: LaporanInsert): Promise<LaporanRow> {
  if (USE_PG) {
    const pool = await getPool();
    const { rows } = await pool.query(
      `INSERT INTO laporan (
        waktu, tanggal, petugas, area_id, area_nama, shift,
        sudah_dibersihkan, belum_dibersihkan,
        sampah_infeksius, sampah_anorganik, sampah_safety_box, sampah_kardus,
        logistik_kuning_90, logistik_kuning_60, logistik_kuning_40,
        logistik_hitam_90, logistik_hitam_60, logistik_hitam_40,
        logistik_ungu, logistik_coklat, logistik_safety_box, logistik_hand_towel,
        kendala, foto_url
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
      ) RETURNING *`,
      [
        data.waktu, data.tanggal, data.petugas, data.area_id, data.area_nama,
        data.shift, data.sudah_dibersihkan, data.belum_dibersihkan,
        data.sampah_infeksius, data.sampah_anorganik, data.sampah_safety_box,
        data.sampah_kardus, data.logistik_kuning_90, data.logistik_kuning_60,
        data.logistik_kuning_40, data.logistik_hitam_90, data.logistik_hitam_60,
        data.logistik_hitam_40, data.logistik_ungu, data.logistik_coklat,
        data.logistik_safety_box, data.logistik_hand_towel,
        data.kendala || null, data.foto_url || null,
      ],
    );
    return rows[0] as LaporanRow;
  } else {
    const supabase = await getSupabase();
    const { data: result, error } = await supabase
      .from('laporan')
      .insert([data])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return result as LaporanRow;
  }
}

// ============================================
// GET DASHBOARD BUNDLE
// ============================================

export async function dbGetDashboardBundle(filters: {
  tanggal: string;
  shift?: string;
  area?: string;
  petugas?: string;
}) {
  let rows: LaporanRow[];

  if (USE_PG) {
    const pool = await getPool();
    const conditions: string[] = [];
    const params: (string | number)[] = [];
    let i = 1;

    if (filters.tanggal) {
      conditions.push(`tanggal = $${i++}`);
      params.push(filters.tanggal);
    }
    if (filters.shift) {
      conditions.push(`shift = $${i++}`);
      params.push(filters.shift);
    }
    if (filters.area) {
      conditions.push(`area_id = $${i++}`);
      params.push(parseInt(filters.area));
    }
    if (filters.petugas) {
      conditions.push(`petugas ILIKE $${i++}`);
      params.push(`%${filters.petugas}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows: pgRows } = await pool.query(
      `SELECT id, waktu, tanggal, petugas, area_id, area_nama, shift, status,
              kendala, foto_url, sudah_dibersihkan, belum_dibersihkan,
              sampah_infeksius, sampah_anorganik, sampah_safety_box, sampah_kardus,
              logistik_kuning_90, logistik_kuning_60, logistik_kuning_40,
              logistik_hitam_90, logistik_hitam_60, logistik_hitam_40,
              logistik_ungu, logistik_coklat, logistik_safety_box, logistik_hand_towel,
              created_at
       FROM laporan ${where}
       ORDER BY created_at DESC`,
      params,
    );
    rows = pgRows as LaporanRow[];
  } else {
    const supabase = await getSupabase();
    let query = supabase
      .from('laporan')
      .select(
        'id, waktu, tanggal, petugas, area_id, area_nama, shift, status, kendala, foto_url, ' +
        'sudah_dibersihkan, belum_dibersihkan, sampah_infeksius, sampah_anorganik, ' +
        'sampah_safety_box, sampah_kardus, logistik_kuning_90, logistik_kuning_60, ' +
        'logistik_kuning_40, logistik_hitam_90, logistik_hitam_60, logistik_hitam_40, ' +
        'logistik_ungu, logistik_coklat, logistik_safety_box, logistik_hand_towel, created_at',
      );

    if (filters.tanggal) query = query.eq('tanggal', filters.tanggal);
    query = query.order('created_at', { ascending: false });
    if (filters.shift) query = query.eq('shift', filters.shift);
    if (filters.area) query = query.eq('area_id', parseInt(filters.area));
    if (filters.petugas) query = query.ilike('petugas', `%${filters.petugas}%`);

    const { data, error } = await query;
    if (error) throw error;
    rows = data as LaporanRow[];
  }

  // === Compute stats, chartData, garbage ===

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
          0,
        )
        .toFixed(1),
    ),
    totalKendala: rows.filter((r) => r.kendala).length,
  };

  const shiftMap: Record<string, { laporan: number; selesai: number; kendala: number }> = {};
  rows.forEach((r) => {
    if (!shiftMap[r.shift]) shiftMap[r.shift] = { laporan: 0, selesai: 0, kendala: 0 };
    shiftMap[r.shift].laporan++;
    if (r.status === 'selesai') shiftMap[r.shift].selesai++;
    else if (r.status === 'kendala') shiftMap[r.shift].kendala++;
  });
  const chartData = Object.entries(shiftMap).map(([shift, c]) => ({ shift, ...c }));

  const garbage = {
    infeksius: parseFloat(rows.reduce((s, r) => s + Number(r.sampah_infeksius), 0).toFixed(1)),
    anorganik: parseFloat(rows.reduce((s, r) => s + Number(r.sampah_anorganik), 0).toFixed(1)),
    safetyBox: parseFloat(rows.reduce((s, r) => s + Number(r.sampah_safety_box), 0).toFixed(1)),
    kardus: parseFloat(rows.reduce((s, r) => s + Number(r.sampah_kardus), 0).toFixed(1)),
  };

  return { rows, stats, chartData, garbage };
}

// ============================================
// STOK BARANG — CRUD
// ============================================

export async function dbInsertStokBarang(data: StokBarangInsert): Promise<StokBarangRow> {
  if (USE_PG) {
    const pool = await getPool();
    const { rows } = await pool.query(
      `INSERT INTO stok_barang (nama_barang, stok_awal, pengambilan, tanggal, satuan, keterangan)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        data.nama_barang, data.stok_awal, data.pengambilan,
        data.tanggal, data.satuan || null, data.keterangan || null,
      ],
    );
    return rows[0] as StokBarangRow;
  } else {
    const supabase = await getSupabase();
    const { data: result, error } = await supabase
      .from('stok_barang')
      .insert([data])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return result as StokBarangRow;
  }
}

export async function dbFetchStokBarang(tanggal?: string): Promise<StokBarangRow[]> {
  if (USE_PG) {
    const pool = await getPool();
    let sql = 'SELECT * FROM stok_barang';
    const params: string[] = [];

    if (tanggal) {
      sql += ' WHERE tanggal = $1';
      params.push(tanggal);
    }

    sql += ' ORDER BY nama_barang ASC, tanggal DESC';
    const { rows } = await pool.query(sql, params);
    return rows as StokBarangRow[];
  } else {
    const supabase = await getSupabase();
    let query = supabase
      .from('stok_barang')
      .select('*')
      .order('nama_barang', { ascending: true })
      .order('tanggal', { ascending: false });

    if (tanggal) query = query.eq('tanggal', tanggal);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as StokBarangRow[];
  }
}

export async function dbUpdateStokBarang(
  id: string,
  data: Partial<StokBarangInsert>,
): Promise<StokBarangRow> {
  if (USE_PG) {
    const pool = await getPool();
    const fields: string[] = [];
    const values: (string | number | null)[] = [];
    let i = 1;

    if (data.nama_barang !== undefined) { fields.push(`nama_barang = $${i++}`); values.push(data.nama_barang); }
    if (data.stok_awal !== undefined)    { fields.push(`stok_awal = $${i++}`);    values.push(data.stok_awal); }
    if (data.pengambilan !== undefined)  { fields.push(`pengambilan = $${i++}`);  values.push(data.pengambilan); }
    if (data.tanggal !== undefined)      { fields.push(`tanggal = $${i++}`);      values.push(data.tanggal); }
    if (data.satuan !== undefined)       { fields.push(`satuan = $${i++}`);       values.push(data.satuan ?? null); }
    if (data.keterangan !== undefined)   { fields.push(`keterangan = $${i++}`);   values.push(data.keterangan ?? null); }

    if (fields.length === 0) throw new Error('Tidak ada field untuk diupdate');

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE stok_barang SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values,
    );
    return rows[0] as StokBarangRow;
  } else {
    const supabase = await getSupabase();
    const { data: result, error } = await supabase
      .from('stok_barang')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return result as StokBarangRow;
  }
}

export async function dbDeleteStokBarang(id: string): Promise<void> {
  if (USE_PG) {
    const pool = await getPool();
    await pool.query('DELETE FROM stok_barang WHERE id = $1', [id]);
  } else {
    const supabase = await getSupabase();
    const { error } = await supabase.from('stok_barang').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

export async function dbGetStokTimeSeries(): Promise<StokTimeSeriesItem[]> {
  let rawRows: { nama_barang: string; satuan: string | null; tanggal: string; pengambilan: number }[];

  if (USE_PG) {
    const pool = await getPool();
    const { rows } = await pool.query(
      `SELECT nama_barang, satuan, tanggal, pengambilan
       FROM stok_barang ORDER BY tanggal ASC`,
    );
    rawRows = rows;
  } else {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('stok_barang')
      .select('nama_barang, satuan, tanggal, pengambilan')
      .order('tanggal', { ascending: true });

    if (error) {
      console.error('Error fetching stok time series:', error);
      return [];
    }
    rawRows = data;
  }

  // Group by nama_barang
  const grouped: Record<string, { satuan: string; data: { tanggal: string; pengambilan: number }[] }> =
    {};

  rawRows.forEach((row) => {
    if (!grouped[row.nama_barang]) {
      grouped[row.nama_barang] = { satuan: row.satuan || '', data: [] };
    }
    grouped[row.nama_barang].data.push({
      tanggal: row.tanggal,
      pengambilan: Number(row.pengambilan),
    });
  });

  return Object.entries(grouped).map(([nama, content]) => ({
    nama_barang: nama,
    satuan: content.satuan,
    data: content.data,
  }));
}
