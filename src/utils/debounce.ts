export function debounce<T extends (...args: any[]) => any>(
    func: T, 
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: number | null = null;
    
    return function(this: any, ...args: Parameters<T>): void {
        const context = this;
        if (timeout !== null) clearTimeout(timeout);
        timeout = window.setTimeout(() => func.apply(context, args), wait);
    };
}