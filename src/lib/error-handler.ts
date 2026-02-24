/**
 * Unified Error Handler untuk SIKHAKI
 * - Konsisten error wrapping untuk semua operasi Supabase
 * - Opsional: Kirim alert ke Telegram untuk error critical
 */

type ErrorSeverity = 'info' | 'warning' | 'critical';

interface AppError {
    code: string;
    message: string;
    severity: ErrorSeverity;
    context?: Record<string, unknown>;
}

/**
 * Kirim alert ke Telegram saat error critical terjadi.
 * Memerlukan TELEGRAM_BOT_TOKEN dan TELEGRAM_CHAT_ID di .env.local
 * Jika tidak ada, fungsi ini silent (tidak error).
 */
async function sendTelegramAlert(error: AppError) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    const message = [
        `🚨 *SIKHAKI Error Alert*`,
        ``,
        `*Severity:* ${error.severity.toUpperCase()}`,
        `*Code:* \`${error.code}\``,
        `*Message:* ${error.message}`,
        `*Time:* ${new Date().toISOString()}`,
        error.context ? `*Context:* \`${JSON.stringify(error.context)}\`` : '',
    ].filter(Boolean).join('\n');

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
            }),
        });
    } catch (e) {
        console.error('Failed to send Telegram alert:', e);
    }
}

/**
 * Wrapper konsisten untuk semua operasi Supabase.
 * - Error selalu di-log ke console
 * - Error critical dikirim ke Telegram (jika dikonfigurasi)
 * - Throw error yang konsisten
 *
 * @param operation - Fungsi yang mengembalikan Supabase response
 * @param context - Nama operasi (untuk debugging)
 */
export async function safeQuery<T>(
    operation: () => PromiseLike<{ data: T | null; error: { code?: string; message: string } | null }>,
    context: string
): Promise<T> {
    const { data, error } = await operation();

    if (error) {
        const appError: AppError = {
            code: error.code || 'UNKNOWN',
            message: error.message,
            severity: error.code === 'PGRST301' ? 'warning' : 'critical',
            context: { operation: context },
        };

        console.error(`[${context}]`, error);

        // Alert untuk error critical (fire-and-forget)
        if (appError.severity === 'critical') {
            sendTelegramAlert(appError);
        }

        throw new Error(`[${context}] ${error.message}`);
    }

    return data as T;
}
