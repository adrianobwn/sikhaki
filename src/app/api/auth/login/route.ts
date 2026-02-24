import { NextRequest, NextResponse } from 'next/server';

// Passwords disimpan di environment variable (server-only, tidak ter-expose ke client)
const PASSWORDS: Record<string, string | undefined> = {
    admin: process.env.ADMIN_PASSWORD,
    gudang: process.env.GUDANG_PASSWORD,
};

export async function POST(req: NextRequest) {
    try {
        const { password, role } = await req.json();

        // Validasi input
        if (!password || !role || typeof password !== 'string' || typeof role !== 'string') {
            return NextResponse.json(
                { error: 'Password dan role wajib diisi.' },
                { status: 400 }
            );
        }

        // Cek role valid
        const expectedPassword = PASSWORDS[role];
        if (!expectedPassword) {
            return NextResponse.json(
                { error: 'Role tidak valid.' },
                { status: 400 }
            );
        }

        // Verifikasi password di server
        if (password !== expectedPassword) {
            // Delay 1 detik untuk memperlambat brute-force
            await new Promise((r) => setTimeout(r, 1000));
            return NextResponse.json(
                { error: 'Password salah. Hubungi supervisor untuk akses.' },
                { status: 401 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: 'Terjadi kesalahan server.' },
            { status: 500 }
        );
    }
}
