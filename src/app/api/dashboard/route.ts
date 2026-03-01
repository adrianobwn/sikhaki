import { NextRequest, NextResponse } from 'next/server';
import { dbGetDashboardBundle } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      tanggal: searchParams.get('tanggal') || '',
      shift: searchParams.get('shift') || undefined,
      area: searchParams.get('area') || undefined,
      petugas: searchParams.get('petugas') || undefined,
    };

    const bundle = await dbGetDashboardBundle(filters);
    return NextResponse.json(bundle);
  } catch (err) {
    console.error('API /api/dashboard error:', err);
    return NextResponse.json(
      { error: 'Gagal mengambil data dashboard.' },
      { status: 500 },
    );
  }
}
