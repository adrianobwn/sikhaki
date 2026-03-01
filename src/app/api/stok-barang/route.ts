import { NextRequest, NextResponse } from 'next/server';
import { dbFetchStokBarang, dbInsertStokBarang } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tanggal = searchParams.get('tanggal') || undefined;
    const data = await dbFetchStokBarang(tanggal);
    return NextResponse.json(data);
  } catch (err) {
    console.error('API /api/stok-barang GET error:', err);
    return NextResponse.json(
      { error: 'Gagal mengambil data stok.' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await dbInsertStokBarang(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('API /api/stok-barang POST error:', err);
    return NextResponse.json(
      { error: 'Gagal menyimpan stok barang.' },
      { status: 500 },
    );
  }
}
