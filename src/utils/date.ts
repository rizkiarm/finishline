// Add days to a date
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Return true if date is in the future
export function isFuture(date: Date | string | number): boolean {
    return new Date(date).getTime() > Date.now();
}

// Get the number of seconds between two dates
export function secondsBetween(
    a: Date | string | number,
    b: Date | string | number,
): number {
    return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 1000);
}
