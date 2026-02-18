-- ============================================
-- SIKHAKI DUMMY DATA
-- Jalankan di Supabase SQL Editor
-- ============================================

-- ============================================
-- MIGRATION: SATUAN untuk stok_barang
-- ============================================
ALTER TABLE stok_barang ADD COLUMN IF NOT EXISTS satuan TEXT;
COMMENT ON COLUMN stok_barang.satuan IS 'Satuan barang (Pcs, Rim, Box, dll)';

-- ============================================
-- HAPUS DATA LAMA
-- ============================================
DELETE FROM stok_barang;
DELETE FROM laporan;

-- ============================================
-- DUMMY DATA: stok_barang (GUDANG)
-- Periode: Januari - Februari 2026
-- ============================================

INSERT INTO stok_barang (nama_barang, satuan, stok_awal, pengambilan, tanggal) VALUES
-- === PEKAN 1 JANUARI 2026 ===
('Hitam 40', 'Pcs', 50, 5, '2026-01-05'),
('Hitam 60', 'Pcs', 50, 8, '2026-01-05'),
('Hitam 90', 'Pcs', 40, 3, '2026-01-05'),
('Kuning 40', 'Pcs', 60, 10, '2026-01-06'),
('Kuning 60', 'Pcs', 50, 7, '2026-01-06'),
('Kuning 90', 'Pcs', 40, 5, '2026-01-06'),
('Ungu 40', 'Pcs', 30, 2, '2026-01-07'),

-- === PEKAN 2 JANUARI 2026 ===
('Ungu 60', 'Pcs', 30, 4, '2026-01-12'),
('Coklat 40', 'Pcs', 25, 3, '2026-01-12'),
('Coklat 60', 'Pcs', 25, 2, '2026-01-12'),
('Hand Towel', 'Pack', 100, 15, '2026-01-13'),
('Hand Soap (Calmic)', 'Botol', 20, 2, '2026-01-13'),
('Tisu Roll', 'Roll', 200, 25, '2026-01-14'),

-- === PEKAN 3 JANUARI 2026 ===
('Safety Box Jerigen 5 L', 'Pcs', 15, 1, '2026-01-19'),
('Safety Box Kontainer 5 L', 'Pcs', 15, 2, '2026-01-20'),
('Safety Box Kontainer 1 L', 'Pcs', 30, 5, '2026-01-20'),
('Floor Cleaner', 'Jerigen', 10, 1, '2026-01-21'),
('Karbol', 'Jerigen', 10, 2, '2026-01-21'),
('Bowl Getter', 'Botol', 15, 3, '2026-01-22'),

-- === PEKAN 4 JANUARI 2026 ===
('Detergent Boom', 'Bungkus', 50, 8, '2026-01-26'),
('Pengharum Toilet/Stella', 'Pcs', 40, 6, '2026-01-27'),
('Tapas Hijau', 'Pcs', 30, 5, '2026-01-28'),
('Kuas', 'Pcs', 20, 2, '2026-01-29'),
('Kape', 'Pcs', 15, 1, '2026-01-29'),
('Sprayer', 'Pcs', 10, 2, '2026-01-30'),

-- === PEKAN 1 FEBRUARI 2026 ===
('Nilon Broom', 'Pcs', 15, 3, '2026-02-02'),
('Broom set Dustpan mini', 'Set', 10, 2, '2026-02-03'),
('Lobby Duster', 'Set', 5, 1, '2026-02-04'),
('Tissue Facial (Wajah)', 'Box', 80, 10, '2026-02-05'),
('Refill Looby', 'Pcs', 15, 2, '2026-02-06'),

-- === PEKAN 2 FEBRUARI 2026 ===
('Refill Mop Kuning', 'Pcs', 20, 4, '2026-02-09'),
('Refill Mop Merah', 'Pcs', 20, 3, '2026-02-10'),
('Refill Mop Hijau', 'Pcs', 20, 5, '2026-02-11'),
('Refill Mop Biru', 'Pcs', 20, 2, '2026-02-12'),
('Lap Micro Fiber Merah', 'Pcs', 30, 6, '2026-02-13'),
('Lap Micro Fiber Kuning', 'Pcs', 30, 8, '2026-02-13'),
('Lap Micro Fiber Hijau', 'Pcs', 30, 7, '2026-02-14'),
('Lap Micro Fiber Biru', 'Pcs', 30, 5, '2026-02-14'),
('Disinfektan H2O2', 'Jerigen', 10, 1, '2026-02-15'),

-- === PEKAN 3 FEBRUARI 2026 ===
('Hitam 40', 'Pcs', 45, 6, '2026-02-16'),
('Hitam 60', 'Pcs', 42, 7, '2026-02-16'),
('Kuning 40', 'Pcs', 50, 9, '2026-02-16'),
('Hand Towel', 'Pack', 85, 12, '2026-02-16'),
('Tisu Roll', 'Roll', 175, 20, '2026-02-16');


-- ============================================
-- DUMMY DATA: laporan (ADMIN DASHBOARD)
-- Periode: 16 Februari 2026 (hari ini)
-- ============================================

INSERT INTO laporan (waktu, tanggal, petugas, area_id, area_nama, shift, sudah_dibersihkan, belum_dibersihkan, sampah_infeksius, sampah_anorganik, sampah_safety_box, sampah_kardus, logistik_kuning_90, logistik_kuning_60, logistik_kuning_40, logistik_hitam_90, logistik_hitam_60, logistik_hitam_40, logistik_ungu, logistik_coklat, logistik_safety_box, logistik_hand_towel, kendala, foto_url, status) VALUES

-- ===== SHIFT PAGI (P) - 06.00-14.00 =====
('06:15', '2026-02-16', 'Slamet Riyadi', 1, 'Poli Melati, Parkir Lt.2 & 3, PU, Lapangan Parkir Belakang', 'P',
 'Lantai disapu & dipel, kaca pintu dilap, tempat sampah dikosongkan', NULL,
 2.5, 1.0, 0, 0.5, 2, 1, 3, 1, 2, 2, 0, 0, 1, 5,
 NULL, NULL, 'selesai'),

('06:30', '2026-02-16', 'Bambang Susanto', 9, 'Lobby, Gedung Entrance & Endoscopy, Toilet Umum Lobby, Registrasi, Poli Lt.1', 'P',
 'Lobby & entrance dipel, toilet umum dibersihkan, kaca dilap', NULL,
 1.5, 2.0, 0, 1.0, 3, 2, 4, 2, 3, 3, 1, 0, 0, 8,
 NULL, NULL, 'selesai'),

('06:45', '2026-02-16', 'Agus Prasetyo', 12, 'IGD Lt.1 & 2', 'P',
 'Ruang IGD Lt.1 dipel, bed-bed dibersihkan', 'IGD Lt.2 area tunggu',
 5.0, 1.5, 1.0, 0, 4, 3, 5, 2, 1, 2, 3, 1, 2, 4,
 'Ada tumpahan cairan infus di lorong IGD Lt.2, perlu pembersihan khusus', NULL, 'kendala'),

('07:00', '2026-02-16', 'Wati Suryani', 6, 'Anggrek Eksekutif Lt.1', 'P',
 'Seluruh area eksekutif Lt.1 dibersihkan, bed ganti sprei, kamar mandi dipel', NULL,
 3.0, 0.5, 0.5, 0, 2, 2, 3, 1, 1, 1, 1, 1, 1, 6,
 NULL, NULL, 'selesai'),

('07:15', '2026-02-16', 'Dedi Kurniawan', 10, 'Farmasi Lt.1, Logistik, Lift Kuning & Koridor Lt.1, Laundry & Kitchen, Koridor Belakang', 'P',
 'Koridor dipel, lift kuning dilap, area farmasi dibersihkan', 'Area kitchen belum selesai',
 1.0, 3.5, 0, 2.0, 1, 1, 2, 2, 3, 4, 0, 1, 0, 3,
 'Lift kuning sempat macet 30 menit, tidak bisa bersihkan dalam lift', NULL, 'kendala'),

('07:30', '2026-02-16', 'Rina Marlina', 2, 'Halaman, Taman Wings, Taman Herbal', 'P1',
 'Halaman disapu, taman Wings disiram, daun kering dibuang, rumput dipotong', NULL,
 0, 0.5, 0, 0, 0, 0, 0, 3, 2, 5, 0, 0, 0, 0,
 NULL, NULL, 'selesai'),

('07:45', '2026-02-16', 'Hendra Saputra', 13, 'Energy Center, Parkir Dokter Spesialis, IPAL', 'P1',
 'Area parkir disapu, IPAL dicek, sampah dikumpulkan', NULL,
 0, 1.0, 0, 3.0, 0, 0, 0, 2, 3, 4, 0, 0, 0, 0,
 NULL, NULL, 'selesai'),

-- ===== NON SHIFT (NS) - 07.00-16.00 =====
('07:00', '2026-02-16', 'Sri Wahyuni', 5, 'Gedung Admin', 'NS',
 'Ruang meeting dipel, meja dilap, toilet admin dibersihkan, kaca dilap', NULL,
 0.5, 1.0, 0, 1.5, 1, 0, 2, 1, 1, 2, 0, 0, 0, 4,
 NULL, NULL, 'selesai'),

('07:15', '2026-02-16', 'Joko Widodo', 14, 'Poli Seluruh Lt.2, CSSD, Lab, Gudang Farmasi', 'NS',
 'Lab dibersihkan, CSSD area steril dipel, gudang farmasi disapu', 'Poli anak belum selesai',
 4.0, 2.0, 2.0, 1.0, 5, 3, 6, 2, 2, 3, 2, 1, 3, 6,
 NULL, NULL, 'selesai'),

('07:30', '2026-02-16', 'Nur Hidayah', 16, 'ICU, NS All & Koridor Belakang, HD, Pain Clinic, Koridor Tengah, Toilet Umum, ODC', 'NS',
 'ICU dibersihkan dengan protokol ketat, HD area dipel, toilet umum dibersihkan', NULL,
 6.0, 1.0, 1.5, 0, 6, 4, 7, 3, 2, 2, 4, 2, 3, 8,
 NULL, NULL, 'selesai'),

('08:00', '2026-02-16', 'Yusuf Maulana', 8, 'Dental, IT', 'NS',
 'Ruang dental sterilisasi, ruang IT disapu & dipel, meja dilap', NULL,
 1.0, 0.5, 0, 0, 1, 1, 2, 0, 1, 1, 0, 0, 0, 2,
 NULL, NULL, 'selesai'),

('08:15', '2026-02-16', 'Fitri Handayani', 15, 'COT', 'NS',
 'COT area operasi dibersihkan, instrumen dicek, lantai dipel', NULL,
 3.5, 0.5, 0.5, 0, 3, 2, 4, 1, 1, 1, 2, 1, 2, 3,
 NULL, NULL, 'selesai'),

-- ===== SHIFT MIDDLE (MD) - 10.00-18.00 =====
('10:00', '2026-02-16', 'Dwi Cahyono', 7, 'Anggrek Eksekutif M2', 'MD',
 'Area M2 dipel ulang, bed-bed diperiksa, kamar mandi dicek', NULL,
 2.0, 0.5, 0, 0, 2, 1, 3, 1, 1, 1, 1, 0, 1, 4,
 NULL, NULL, 'selesai'),

('10:15', '2026-02-16', 'Ratna Dewi', 17, 'Lt.5 & VK', 'MD',
 'Lt.5 kamar pasien dipel, VK disterilkan, toilet dibersihkan', NULL,
 4.5, 1.0, 1.0, 0.5, 4, 3, 5, 2, 1, 2, 3, 1, 2, 7,
 NULL, NULL, 'selesai'),

('10:30', '2026-02-16', 'Eko Prasetyo', 18, 'Lt.6', 'MD',
 'Seluruh kamar dibersihkan, koridor dipel, tempat sampah dikosongkan', NULL,
 3.0, 1.5, 0, 0, 3, 2, 4, 2, 2, 3, 1, 0, 1, 5,
 NULL, NULL, 'selesai'),

('10:45', '2026-02-16', 'Siti Aminah', 19, 'Lt.10', 'MD',
 'Kamar VIP disapu & dipel, kamar mandi disikat, kaca dilap', NULL,
 2.5, 0.5, 0, 0, 2, 2, 3, 1, 1, 1, 1, 1, 0, 6,
 NULL, NULL, 'selesai'),

-- ===== NON SHIFT 2 (NS 2) - 11.00-20.00 =====
('11:00', '2026-02-16', 'Andi Firmansyah', 20, 'Lt.11', 'NS 2',
 'Area Lt.11 dipel, tempat sampah diganti, kamar mandi dicek', NULL,
 2.0, 1.0, 0, 0, 2, 1, 3, 1, 2, 2, 1, 0, 0, 4,
 NULL, NULL, 'selesai'),

('11:15', '2026-02-16', 'Maya Putri', 21, 'Lt.12', 'NS 2',
 'Kamar pasien dibersihkan, koridor dipel, nurse station dilap', 'Lift barang Lt.12 mati',
 3.0, 1.0, 0.5, 0, 3, 2, 4, 2, 1, 2, 2, 1, 1, 5,
 'Lift barang di Lt.12 tidak berfungsi, sampah harus dibawa lewat tangga darurat', NULL, 'kendala'),

('11:30', '2026-02-16', 'Hadi Santoso', 22, 'Lt.13', 'NS 2',
 'Seluruh area Lt.13 dibersihkan termasuk kamar isolasi', NULL,
 4.0, 1.5, 1.0, 0, 4, 3, 5, 2, 2, 3, 3, 1, 2, 6,
 NULL, NULL, 'selesai'),

('11:45', '2026-02-16', 'Lestari Wulandari', 23, 'Lt.14', 'NS 2',
 'Area Lt.14 ruang VIP dibersihkan, kamar mandi dipel & disikat', NULL,
 2.0, 0.5, 0, 0, 2, 1, 3, 1, 1, 1, 1, 0, 0, 5,
 NULL, NULL, 'selesai'),

-- ===== SHIFT SIANG (S) - 14.00-22.00 =====
('14:00', '2026-02-16', 'Budi Setiawan', 9, 'Lobby, Gedung Entrance & Endoscopy, Toilet Umum Lobby, Registrasi, Poli Lt.1', 'S',
 'Lobby dipel ulang siang, toilet umum dicek & dibersihkan, registrasi dilap', NULL,
 1.0, 1.5, 0, 0.5, 2, 1, 3, 1, 2, 2, 0, 0, 0, 6,
 NULL, NULL, 'selesai'),

('14:15', '2026-02-16', 'Teguh Prabowo', 12, 'IGD Lt.1 & 2', 'S',
 'IGD shift siang dipel, area triage dibersihkan, sampah dibuang', NULL,
 4.5, 2.0, 0.5, 0, 3, 2, 4, 2, 1, 2, 2, 1, 1, 4,
 NULL, NULL, 'selesai'),

('14:30', '2026-02-16', 'Dian Pratiwi', 16, 'ICU, NS All & Koridor Belakang, HD, Pain Clinic, Koridor Tengah, Toilet Umum, ODC', 'S',
 'ICU pembersihan rutin siang, koridor dan toilet dicek ulang', NULL,
 5.0, 1.0, 1.0, 0, 5, 3, 6, 2, 2, 2, 3, 1, 2, 7,
 NULL, NULL, 'selesai'),

('14:45', '2026-02-16', 'Arief Budiman', 11, 'Radiologi, Forensik, CR', 'S',
 'Radiologi dibersihkan setelah jam praktek, CR dipel, forensik dicek', NULL,
 2.0, 0.5, 0, 0, 1, 1, 2, 1, 1, 1, 0, 0, 0, 2,
 NULL, NULL, 'selesai'),

-- ===== SHIFT MIDDLE 2 (MD 2) - 12.00-20.00 =====
('12:00', '2026-02-16', 'Lia Rahmawati', 4, 'Staff Quarter & SQ Lt.1', 'MD 2',
 'SQ dipel, kamar mandi dicek, area bersama disapu', NULL,
 0.5, 0.5, 0, 0, 1, 0, 1, 1, 1, 2, 0, 0, 0, 3,
 NULL, NULL, 'selesai'),

('12:15', '2026-02-16', 'Rizky Maulana', 3, 'Halaman, Taman Wings, Taman Herbal, PU (Landscape)', 'MD 2',
 'Taman disiram siang, daun kering dibereskan, area PU dicek', NULL,
 0, 0.5, 0, 0, 0, 0, 0, 2, 1, 3, 0, 0, 0, 0,
 NULL, NULL, 'selesai');


-- ============================================
-- DUMMY DATA: laporan - HARI KEMARIN
-- Tanggal: 15 Februari 2026
-- (untuk testing filter tanggal)
-- ============================================

INSERT INTO laporan (waktu, tanggal, petugas, area_id, area_nama, shift, sudah_dibersihkan, belum_dibersihkan, sampah_infeksius, sampah_anorganik, sampah_safety_box, sampah_kardus, logistik_kuning_90, logistik_kuning_60, logistik_kuning_40, logistik_hitam_90, logistik_hitam_60, logistik_hitam_40, logistik_ungu, logistik_coklat, logistik_safety_box, logistik_hand_towel, kendala, foto_url, status) VALUES

('06:15', '2026-02-15', 'Slamet Riyadi', 1, 'Poli Melati, Parkir Lt.2 & 3, PU, Lapangan Parkir Belakang', 'P',
 'Seluruh area poli melati dibersihkan, parkir disapu', NULL,
 2.0, 1.5, 0, 1.0, 2, 1, 3, 1, 2, 3, 0, 0, 1, 4,
 NULL, NULL, 'selesai'),

('06:30', '2026-02-15', 'Bambang Susanto', 9, 'Lobby, Gedung Entrance & Endoscopy, Toilet Umum Lobby, Registrasi, Poli Lt.1', 'P',
 'Lobby bersih, toilet umum dipel, kaca dilap', NULL,
 1.5, 2.5, 0, 0.5, 3, 2, 4, 2, 3, 3, 1, 0, 0, 7,
 NULL, NULL, 'selesai'),

('07:00', '2026-02-15', 'Agus Prasetyo', 12, 'IGD Lt.1 & 2', 'P',
 'IGD Lt.1 & 2 dibersihkan menyeluruh', NULL,
 6.0, 2.0, 1.5, 0, 5, 4, 6, 2, 2, 3, 4, 1, 3, 5,
 NULL, NULL, 'selesai'),

('07:15', '2026-02-15', 'Sri Wahyuni', 5, 'Gedung Admin', 'NS',
 'Gedung admin bersih, meeting room siap', NULL,
 0.5, 1.0, 0, 2.0, 1, 0, 2, 1, 1, 2, 0, 0, 0, 3,
 NULL, NULL, 'selesai'),

('07:30', '2026-02-15', 'Nur Hidayah', 16, 'ICU, NS All & Koridor Belakang, HD, Pain Clinic, Koridor Tengah, Toilet Umum, ODC', 'NS',
 'ICU bersih, semua koridor dipel', NULL,
 5.5, 1.0, 2.0, 0, 5, 3, 6, 3, 2, 2, 3, 2, 3, 9,
 NULL, NULL, 'selesai'),

('08:00', '2026-02-15', 'Fitri Handayani', 15, 'COT', 'NS',
 'COT steril, semua area operasi dibersihkan', NULL,
 4.0, 0.5, 1.0, 0, 3, 2, 5, 1, 1, 1, 2, 1, 2, 4,
 NULL, NULL, 'selesai'),

('10:00', '2026-02-15', 'Ratna Dewi', 17, 'Lt.5 & VK', 'MD',
 'Lt.5 bersih, VK sterilisasi selesai', 'Gudang VK belum tersusun rapi',
 4.0, 1.5, 1.0, 0.5, 4, 3, 5, 2, 1, 2, 3, 1, 2, 6,
 'Gudang VK penuh, barang belum tersusun rapi sehingga menghambat pembersihan', NULL, 'kendala'),

('10:30', '2026-02-15', 'Eko Prasetyo', 18, 'Lt.6', 'MD',
 'Lt.6 kamar pasien bersih, koridor dipel', NULL,
 3.5, 1.0, 0, 0, 3, 2, 4, 2, 2, 3, 1, 0, 1, 5,
 NULL, NULL, 'selesai'),

('11:00', '2026-02-15', 'Andi Firmansyah', 20, 'Lt.11', 'NS 2',
 'Area Lt.11 bersih menyeluruh', NULL,
 2.5, 1.0, 0, 0, 2, 1, 3, 1, 2, 2, 1, 0, 0, 4,
 NULL, NULL, 'selesai'),

('14:00', '2026-02-15', 'Budi Setiawan', 9, 'Lobby, Gedung Entrance & Endoscopy, Toilet Umum Lobby, Registrasi, Poli Lt.1', 'S',
 'Lobby siang bersih, toilet dicek', NULL,
 1.0, 1.0, 0, 0.5, 2, 1, 3, 1, 2, 2, 0, 0, 0, 5,
 NULL, NULL, 'selesai'),

('14:30', '2026-02-15', 'Teguh Prabowo', 12, 'IGD Lt.1 & 2', 'S',
 'IGD shift siang selesai dibersihkan', 'Ruang observasi IGD Lt.2',
 5.0, 1.5, 0.5, 0, 4, 3, 5, 2, 1, 2, 3, 1, 2, 4,
 'Ruang observasi IGD Lt.2 penuh pasien, tidak bisa dibersihkan sepenuhnya', NULL, 'kendala'),

('22:00', '2026-02-15', 'Herman Wijaya', 9, 'Lobby, Gedung Entrance & Endoscopy, Toilet Umum Lobby, Registrasi, Poli Lt.1', 'M',
 'Lobby malam dipel, area entrance dicek, toilet malam dibersihkan', NULL,
 0.5, 0.5, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 2,
 NULL, NULL, 'selesai');


-- ============================================
-- DUMMY DATA: laporan - 14 Februari 2026
-- (untuk testing histori)
-- ============================================

INSERT INTO laporan (waktu, tanggal, petugas, area_id, area_nama, shift, sudah_dibersihkan, belum_dibersihkan, sampah_infeksius, sampah_anorganik, sampah_safety_box, sampah_kardus, logistik_kuning_90, logistik_kuning_60, logistik_kuning_40, logistik_hitam_90, logistik_hitam_60, logistik_hitam_40, logistik_ungu, logistik_coklat, logistik_safety_box, logistik_hand_towel, kendala, foto_url, status) VALUES

('06:15', '2026-02-14', 'Slamet Riyadi', 1, 'Poli Melati, Parkir Lt.2 & 3, PU, Lapangan Parkir Belakang', 'P',
 'Area poli melati dan parkir dibersihkan', NULL,
 2.0, 1.0, 0, 0.5, 2, 1, 3, 1, 2, 2, 0, 0, 1, 5,
 NULL, NULL, 'selesai'),

('06:30', '2026-02-14', 'Agus Prasetyo', 12, 'IGD Lt.1 & 2', 'P',
 'IGD pagi dibersihkan menyeluruh', NULL,
 5.5, 2.0, 1.0, 0, 4, 3, 5, 2, 1, 2, 3, 1, 2, 5,
 NULL, NULL, 'selesai'),

('07:00', '2026-02-14', 'Sri Wahyuni', 5, 'Gedung Admin', 'NS',
 'Gedung admin lantai 1 & 2 bersih', NULL,
 0.5, 1.0, 0, 1.5, 1, 0, 2, 1, 1, 2, 0, 0, 0, 4,
 NULL, NULL, 'selesai'),

('07:30', '2026-02-14', 'Nur Hidayah', 16, 'ICU, NS All & Koridor Belakang, HD, Pain Clinic, Koridor Tengah, Toilet Umum, ODC', 'NS',
 'ICU & HD dibersihkan dengan protokol steril', NULL,
 6.5, 1.5, 2.0, 0, 6, 4, 7, 3, 2, 2, 4, 2, 3, 8,
 NULL, NULL, 'selesai'),

('10:00', '2026-02-14', 'Dwi Cahyono', 7, 'Anggrek Eksekutif M2', 'MD',
 'Eksekutif M2 kamar & koridor bersih', NULL,
 2.0, 0.5, 0, 0, 2, 1, 3, 1, 1, 1, 1, 0, 1, 4,
 NULL, NULL, 'selesai'),

('10:30', '2026-02-14', 'Siti Aminah', 19, 'Lt.10', 'MD',
 'Lt.10 VIP room dibersihkan menyeluruh', NULL,
 2.5, 0.5, 0, 0, 2, 2, 3, 1, 1, 1, 1, 1, 0, 6,
 NULL, NULL, 'selesai'),

('14:00', '2026-02-14', 'Dian Pratiwi', 16, 'ICU, NS All & Koridor Belakang, HD, Pain Clinic, Koridor Tengah, Toilet Umum, ODC', 'S',
 'ICU shift siang selesai, koridor & toilet dicek', NULL,
 4.0, 1.0, 1.0, 0, 4, 2, 5, 2, 2, 2, 2, 1, 2, 6,
 NULL, NULL, 'selesai'),

('14:30', '2026-02-14', 'Arief Budiman', 11, 'Radiologi, Forensik, CR', 'S',
 'Radiologi & forensik area dibersihkan', NULL,
 2.0, 0.5, 0, 0, 1, 1, 2, 1, 1, 1, 0, 0, 0, 2,
 NULL, NULL, 'selesai'),

('22:00', '2026-02-14', 'Herman Wijaya', 12, 'IGD Lt.1 & 2', 'M',
 'IGD malam dibersihkan, area triage dipel', NULL,
 3.0, 1.0, 0.5, 0, 2, 1, 3, 1, 1, 1, 1, 0, 1, 3,
 NULL, NULL, 'selesai');
