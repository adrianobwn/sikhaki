import { NextRequest, NextResponse } from 'next/server';
import { dbUpdateStokBarang, dbDeleteStokBarang } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = await dbUpdateStokBarang(id, body);
    return NextResponse.json(result);
  } catch (err) {
    console.error('API /api/stok-barang/[id] PATCH error:', err);
    return NextResponse.json(
      { error: 'Gagal update stok barang.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbDeleteStokBarang(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API /api/stok-barang/[id] DELETE error:', err);
    return NextResponse.json(
      { error: 'Gagal hapus stok barang.' },
      { status: 500 },
    );
  }
}
