/**
 * Timezone utility — memastikan semua waktu menggunakan WIB (Asia/Jakarta, UTC+7).
 * Menggunakan Intl.DateTimeFormat agar konsisten di server (Vercel/Node) dan client.
 */

const WIB_TIMEZONE = 'Asia/Jakarta';

/**
 * Mengembalikan string waktu WIB dalam format "HH.MM", contoh: "15.50"
 */
export function getWIBTimeString(): string {
    const formatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: WIB_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    // Intl returns "15.50" for id-ID locale (dot separator)
    return formatter.format(new Date());
}

/**
 * Mengembalikan string tanggal WIB dalam format "YYYY-MM-DD", contoh: "2026-03-01"
 */
export function getWIBDateString(): string {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: WIB_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    // en-CA locale returns "YYYY-MM-DD" format
    return formatter.format(new Date());
}
