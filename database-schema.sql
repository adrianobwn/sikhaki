-- SIKHAKI Database Schema for Supabase (PostgreSQL)
-- Jalankan script ini di Supabase SQL Editor

-- ============================================
-- TABEL UTAMA: laporan
-- ============================================
CREATE TABLE IF NOT EXISTS laporan (
  -- Primary Key & Timestamps
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Waktu & Tanggal
  waktu TEXT NOT NULL, -- Format "06:15"
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Identitas Petugas
  petugas TEXT NOT NULL,
  area_id INTEGER NOT NULL CHECK (area_id BETWEEN 1 AND 23),
  area_nama TEXT NOT NULL,
  shift TEXT NOT NULL CHECK (shift IN ('NS', 'NS 2', 'MD', 'MD 2', 'P', 'S', 'M', 'L', 'P1', 'P2')),
  
  -- Laporan Kebersihan
  sudah_dibersihkan TEXT,
  belum_dibersihkan TEXT,
  
  -- Volume Sampah (dalam kg)
  sampah_infeksius DECIMAL(10, 2) DEFAULT 0 CHECK (sampah_infeksius >= 0),
  sampah_anorganik DECIMAL(10, 2) DEFAULT 0 CHECK (sampah_anorganik >= 0),
  sampah_safety_box DECIMAL(10, 2) DEFAULT 0 CHECK (sampah_safety_box >= 0),
  sampah_kardus DECIMAL(10, 2) DEFAULT 0 CHECK (sampah_kardus >= 0),
  
  -- Stok Logistik (dalam unit)
  logistik_kuning_90 INTEGER DEFAULT 0 CHECK (logistik_kuning_90 >= 0),
  logistik_kuning_60 INTEGER DEFAULT 0 CHECK (logistik_kuning_60 >= 0),
  logistik_kuning_40 INTEGER DEFAULT 0 CHECK (logistik_kuning_40 >= 0),
  logistik_hitam_90 INTEGER DEFAULT 0 CHECK (logistik_hitam_90 >= 0),
  logistik_hitam_60 INTEGER DEFAULT 0 CHECK (logistik_hitam_60 >= 0),
  logistik_hitam_40 INTEGER DEFAULT 0 CHECK (logistik_hitam_40 >= 0),
  logistik_ungu INTEGER DEFAULT 0 CHECK (logistik_ungu >= 0),
  logistik_coklat INTEGER DEFAULT 0 CHECK (logistik_coklat >= 0),
  logistik_safety_box INTEGER DEFAULT 0 CHECK (logistik_safety_box >= 0),
  logistik_hand_towel INTEGER DEFAULT 0 CHECK (logistik_hand_towel >= 0),
  
  -- Validasi & Status
  kendala TEXT,
  foto_url TEXT,
  status TEXT NOT NULL DEFAULT 'selesai' CHECK (status IN ('selesai', 'kendala'))
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_laporan_tanggal ON laporan(tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_laporan_shift ON laporan(shift);
CREATE INDEX IF NOT EXISTS idx_laporan_area ON laporan(area_id);
CREATE INDEX IF NOT EXISTS idx_laporan_petugas ON laporan(petugas);
CREATE INDEX IF NOT EXISTS idx_laporan_status ON laporan(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE laporan ENABLE ROW LEVEL SECURITY;

-- Policy: Siapa saja bisa insert (public access tanpa auth)
CREATE POLICY "Allow public insert"
ON laporan FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Siapa saja bisa read (untuk dashboard admin)
CREATE POLICY "Allow public read"
ON laporan FOR SELECT
TO public
USING (true);

-- Policy: Tidak ada UPDATE/DELETE dari client (hanya dari server/admin manual)
-- Jika butuh UPDATE nanti, bisa ditambahkan policy khusus dengan auth

-- ============================================
-- STORAGE BUCKET untuk Foto Absen
-- ============================================
-- Jalankan ini di Supabase Storage Dashboard atau via SQL:
-- 1. Buat bucket bernama 'foto-absen'
-- 2. Set ke PUBLIC agar foto bisa diakses tanpa auth
-- 3. Max file size: 5MB, allowed MIME types: image/jpeg, image/png

-- CATATAN: Untuk membuat storage bucket via SQL, jalankan command berikut di SQL Editor:
INSERT INTO storage.buckets (id, name, public)
VALUES ('foto-absen', 'foto-absen', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Siapa saja bisa upload foto
CREATE POLICY "Allow public upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'foto-absen');

-- Policy: Siapa saja bisa baca foto (karena bucket public)
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'foto-absen');

-- ============================================
-- FUNGSI HELPER (Optional)
-- ============================================

-- Fungsi untuk auto-set status berdasarkan kendala
CREATE OR REPLACE FUNCTION set_status_from_kendala()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.kendala IS NOT NULL AND NEW.kendala != '' THEN
    NEW.status := 'kendala';
  ELSE
    NEW.status := 'selesai';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-set status sebelum insert
CREATE TRIGGER trigger_set_status
BEFORE INSERT ON laporan
FOR EACH ROW
EXECUTE FUNCTION set_status_from_kendala();

-- ============================================
-- SAMPLE QUERY untuk Testing
-- ============================================

-- Query untuk dashboard: Total laporan hari ini
-- SELECT COUNT(*) as total_laporan
-- FROM laporan
-- WHERE tanggal = CURRENT_DATE;

-- Query untuk dashboard: Total sampah hari ini
-- SELECT 
--   SUM(sampah_infeksius + sampah_anorganik + sampah_safety_box + sampah_kardus) as total_sampah
-- FROM laporan
-- WHERE tanggal = CURRENT_DATE;

-- Query untuk export data
-- SELECT 
--   id, waktu, tanggal, petugas, area_nama, shift, status,
--   sudah_dibersihkan, belum_dibersihkan, kendala,
--   sampah_infeksius, sampah_anorganik, sampah_safety_box, sampah_kardus,
--   logistik_kuning_90, logistik_kuning_60, logistik_kuning_40,
--   logistik_hitam_90, logistik_hitam_60, logistik_hitam_40,
--   logistik_ungu, logistik_coklat, logistik_safety_box, logistik_hand_towel,
--   foto_url
-- FROM laporan
-- WHERE tanggal = CURRENT_DATE
-- ORDER BY created_at DESC;
