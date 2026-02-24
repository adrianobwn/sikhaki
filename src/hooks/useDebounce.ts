import { useState, useEffect } from 'react';

/**
 * Hook untuk menunda perubahan value sampai user berhenti mengetik.
 * Mencegah request berlebihan saat user sedang mengetik di filter input.
 * 
 * @param value - Nilai yang ingin di-debounce
 * @param delay - Delay dalam milidetik (default: 500ms)
 * @returns Nilai yang sudah di-debounce
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
