# SIKHAKI - Setup Supabase & Database

## Langkah 1: Setup Supabase Project

1. **Buat akun Supabase** di [https://supabase.com](https://supabase.com)
2. **Create New Project**:
   - Organization: Pilih atau buat baru
   - Project Name: `sikhaki-rsui`
   - Database Password: Simpan password ini dengan aman
   - Region: Pilih terdekat (Singapore/Jakarta)
3. Tunggu ~2 menit sampai project selesai dibuat

## Langkah 2: Jalankan SQL Schema

1. Buka **SQL Editor** di Supabase Dashboard (sidebar kiri)
2. Copy seluruh isi file `database-schema.sql`
3. Paste ke SQL Editor
4. Klik **Run** atau tekan `Ctrl + Enter`
5. Pastikan tidak ada error (akan muncul "Success. No rows returned")

## Langkah 3: Setup Storage Bucket

1. Buka **Storage** di Supabase Dashboard
2. Klik **New Bucket**
3. Isi:
   - Name: `foto-absen`
   - Public bucket: ✅ (centang)
   - File size limit: `5` MB
   - Allowed MIME types: `image/jpeg,image/png`
4. Klik **Create Bucket**

## Langkah 4: Dapatkan API Keys

1. Buka **Project Settings** > **API**
2. Copy 2 nilai ini:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Langkah 5: Setup Environment Variables

1. Copy file `.env.local.example` menjadi `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local`, isi dengan API keys dari langkah 4:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Restart development server**:
   ```bash
   npm run dev
   ```

## Langkah 6: Test Database Connection

1. Buka aplikasi di browser: `http://localhost:3000/lapor`
2. Isi form laporan dan submit
3. Cek di Supabase Dashboard > **Table Editor** > tabel `laporan`
4. Pastikan data masuk

## Langkah 7: Test Dashboard Admin

1. Buka `http://localhost:3000/dashboard`
2. Masukkan password: `rsui2026`
3. Pastikan data dari database muncul di dashboard

---

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Pastikan file `.env.local` sudah dibuat dan diisi dengan benar
- Restart development server: `npm run dev`

### Error: "relation 'laporan' does not exist"
- SQL schema belum dijalankan
- Jalankan ulang `database-schema.sql` di SQL Editor

### Foto tidak bisa diupload
- Pastikan bucket `foto-absen` sudah dibuat dan di-set **public**
- Cek Storage policies di SQL Editor

### Data tidak muncul di dashboard
- Cek console browser (F12) untuk error
- Pastikan ada data di tabel `laporan` (cek via Table Editor)

---

## Database Schema Summary

### Tabel `laporan`
- **Identitas**: petugas, area_id, area_nama, shift
- **Kebersihan**: sudah_dibersihkan, belum_dibersihkan
- **Sampah**: sampah_infeksius, sampah_anorganik, sampah_safety_box, sampah_kardus
- **Logistik**: 10 kolom untuk stok plastik & supplies
- **Validasi**: kendala, foto_url, status
- **Metadata**: id (UUID), created_at, waktu, tanggal

### Storage Bucket
- **Bucket name**: `foto-absen`
- **Type**: Public
- **Content**: Foto selfie petugas (JPEG)

---

## Next Steps

Setelah setup selesai:
1. Test form input petugas
2. Verifikasi data masuk ke database
3. Test dashboard admin dengan filter
4. Test export CSV
5. Deploy ke Cloudflare Pages (nanti)
