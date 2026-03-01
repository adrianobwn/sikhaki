-- ============================================
-- SIKHAKI Database Schema — PostgreSQL
-- Jalankan di VPS setelah install PostgreSQL
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABEL: laporan
-- ============================================
CREATE TABLE IF NOT EXISTS laporan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    waktu TEXT NOT NULL,
    tanggal TEXT NOT NULL,
    petugas TEXT NOT NULL,
    area_id INTEGER NOT NULL,
    area_nama TEXT NOT NULL,
    shift TEXT NOT NULL,
    sudah_dibersihkan TEXT DEFAULT '' NOT NULL,
    belum_dibersihkan TEXT DEFAULT '' NOT NULL,
    sampah_infeksius REAL DEFAULT 0 NOT NULL,
    sampah_anorganik REAL DEFAULT 0 NOT NULL,
    sampah_safety_box REAL DEFAULT 0 NOT NULL,
    sampah_kardus REAL DEFAULT 0 NOT NULL,
    logistik_kuning_90 INTEGER DEFAULT 0 NOT NULL,
    logistik_kuning_60 INTEGER DEFAULT 0 NOT NULL,
    logistik_kuning_40 INTEGER DEFAULT 0 NOT NULL,
    logistik_hitam_90 INTEGER DEFAULT 0 NOT NULL,
    logistik_hitam_60 INTEGER DEFAULT 0 NOT NULL,
    logistik_hitam_40 INTEGER DEFAULT 0 NOT NULL,
    logistik_ungu INTEGER DEFAULT 0 NOT NULL,
    logistik_coklat INTEGER DEFAULT 0 NOT NULL,
    logistik_safety_box INTEGER DEFAULT 0 NOT NULL,
    logistik_hand_towel INTEGER DEFAULT 0 NOT NULL,
    kendala TEXT,
    foto_url TEXT,
    status TEXT GENERATED ALWAYS AS (
        CASE WHEN kendala IS NOT NULL AND kendala != '' THEN 'kendala' ELSE 'selesai' END
    ) STORED
);

-- ============================================
-- TABEL: stok_barang
-- ============================================
CREATE TABLE IF NOT EXISTS stok_barang (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    nama_barang TEXT NOT NULL,
    stok_awal REAL DEFAULT 0 NOT NULL,
    pengambilan REAL DEFAULT 0 NOT NULL,
    tanggal TEXT NOT NULL,
    satuan TEXT,
    keterangan TEXT
);

-- ============================================
-- INDEXES untuk performa query
-- ============================================
CREATE INDEX IF NOT EXISTS idx_laporan_tanggal ON laporan(tanggal);
CREATE INDEX IF NOT EXISTS idx_laporan_created_at ON laporan(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stok_barang_tanggal ON stok_barang(tanggal);
CREATE INDEX IF NOT EXISTS idx_stok_barang_nama ON stok_barang(nama_barang);
