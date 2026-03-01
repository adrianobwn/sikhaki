import { NextRequest, NextResponse } from 'next/server';
import { dbInsertLaporan, dbUploadFoto } from '@/lib/db';
import { type LaporanInsert } from '@/lib/supabase';
import { AREAS, SHIFTS } from '@/constants/areas';
import { getWIBTimeString, getWIBDateString } from '@/lib/timezone';

/**
 * POST /api/laporan
 * Server-side endpoint untuk submit laporan.
 * Validasi data sebelum insert ke database — client tidak langsung akses Supabase.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // ============================
        // VALIDASI INPUT
        // ============================

        const { petugas, area_id, shift, foto_base64, ...rest } = body;

        // Wajib: petugas
        if (!petugas || typeof petugas !== 'string' || petugas.trim().length < 2) {
            return NextResponse.json(
                { error: 'Nama petugas wajib diisi (min 2 karakter).' },
                { status: 400 }
            );
        }

        // Wajib: area_id harus valid
        const areaValid = AREAS.find(a => a.id === Number(area_id));
        if (!areaValid) {
            return NextResponse.json(
                { error: 'Area kerja tidak valid.' },
                { status: 400 }
            );
        }

        // Wajib: shift harus valid
        const shiftValid = SHIFTS.find(s => s.code === shift);
        if (!shiftValid) {
            return NextResponse.json(
                { error: 'Shift tidak valid.' },
                { status: 400 }
            );
        }

        // Validasi angka sampah tidak negatif
        const numericFields = [
            'sampah_infeksius', 'sampah_anorganik', 'sampah_safety_box', 'sampah_kardus',
            'logistik_kuning_90', 'logistik_kuning_60', 'logistik_kuning_40',
            'logistik_hitam_90', 'logistik_hitam_60', 'logistik_hitam_40',
            'logistik_ungu', 'logistik_coklat', 'logistik_safety_box', 'logistik_hand_towel'
        ];

        for (const field of numericFields) {
            const val = rest[field];
            if (val !== undefined && (typeof val !== 'number' || val < 0)) {
                return NextResponse.json(
                    { error: `Field ${field} harus berupa angka positif.` },
                    { status: 400 }
                );
            }
        }

        // ============================
        // UPLOAD FOTO (jika ada)
        // ============================
        let foto_url: string | null = null;
        if (foto_base64 && typeof foto_base64 === 'string' && foto_base64.startsWith('data:image')) {
            foto_url = await dbUploadFoto(foto_base64);
        }

        // ============================
        // INSERT KE DATABASE
        // ============================
        const laporanData: LaporanInsert = {
            waktu: rest.waktu || getWIBTimeString(),
            tanggal: rest.tanggal || getWIBDateString(),
            petugas: petugas.trim(),
            area_id: Number(area_id),
            area_nama: areaValid.name,
            shift,
            sudah_dibersihkan: rest.sudah_dibersihkan || '',
            belum_dibersihkan: rest.belum_dibersihkan || '',
            sampah_infeksius: rest.sampah_infeksius || 0,
            sampah_anorganik: rest.sampah_anorganik || 0,
            sampah_safety_box: rest.sampah_safety_box || 0,
            sampah_kardus: rest.sampah_kardus || 0,
            logistik_kuning_90: rest.logistik_kuning_90 || 0,
            logistik_kuning_60: rest.logistik_kuning_60 || 0,
            logistik_kuning_40: rest.logistik_kuning_40 || 0,
            logistik_hitam_90: rest.logistik_hitam_90 || 0,
            logistik_hitam_60: rest.logistik_hitam_60 || 0,
            logistik_hitam_40: rest.logistik_hitam_40 || 0,
            logistik_ungu: rest.logistik_ungu || 0,
            logistik_coklat: rest.logistik_coklat || 0,
            logistik_safety_box: rest.logistik_safety_box || 0,
            logistik_hand_towel: rest.logistik_hand_towel || 0,
            kendala: rest.kendala || undefined,
            foto_url: foto_url || undefined,
        };

        const result = await dbInsertLaporan(laporanData);

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (err) {
        console.error('API /api/laporan error:', err);
        return NextResponse.json(
            { error: 'Gagal menyimpan laporan. Coba lagi.' },
            { status: 500 }
        );
    }
}
