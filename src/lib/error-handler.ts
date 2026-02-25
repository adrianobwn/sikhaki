/**
 * Unified Error Handler untuk SIKHAKI
 * - Konsisten error wrapping untuk semua operasi Supabase
 */

/**
 * Wrapper konsisten untuk semua operasi Supabase.
 * - Error selalu di-log ke console
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
        console.error(`[${context}]`, error);
        throw new Error(`[${context}] ${error.message}`);
    }

    return data as T;
}
