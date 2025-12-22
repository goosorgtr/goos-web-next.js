/**
 * Debounce utility function
 * Delays the execution of a function until after a specified delay
 * 
 * @example
 * const debouncedSearch = debounce((value) => {
 *   console.log('Searching for:', value)
 * }, 500)
 * 
 * debouncedSearch('test') // Will execute after 500ms
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null

    return function (...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
            func(...args)
        }, delay)
    }
}
