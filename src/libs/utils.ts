import crypto from "node:crypto";

export function makeReadonly<T>(obj: T): Readonly<T> {
    return Object.freeze(obj);
}

/**
 * Checks if the application is running in development mode.
 */
export function isInDevelopmentMode() {
    return process.env.NODE_ENV === "development";
}

export type DateStr = `${number}/${number}/${number}`;
export function dateFromString(date: DateStr) {
    const [day, month, year] = date.split('/').map(Number);
    if (!day || !month || !year || month < 1 || month > 12 || day < 1 || day > 31) {
        throw new Error('Invalid date format. Use dd/mm/yyyy.');
    }
    
    const dateObj = new Date(year, month - 1, day);
    if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date value.');
    }
    
    return dateObj;
}

export function formatDateToStr(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

export function sha256(value: string) {
    return crypto.createHash('sha256').update(value).digest('hex');
}