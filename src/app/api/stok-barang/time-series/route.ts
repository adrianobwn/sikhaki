import { NextResponse } from 'next/server';
import { dbGetStokTimeSeries } from '@/lib/db';

export async function GET() {
  try {
    const data = await dbGetStokTimeSeries();
    return NextResponse.json(data);
  } catch (err) {
    console.error('API /api/stok-barang/time-series GET error:', err);
    return NextResponse.json(
      { error: 'Gagal mengambil data time series.' },
      { status: 500 },
    );
  }
}
