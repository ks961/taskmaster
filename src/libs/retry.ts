import { asyncSleep } from "./utils";


export async function retry<T>(
    fn: () => Promise<T>,
    maxCall = 5,
    baseDelay = 1000,
    backoff = 2
): Promise<T | null> {
    let attempt = 0;

    while (attempt < maxCall) {
        try {
            return await fn();
        } catch (err) {
            attempt++;
            if (attempt === maxCall) return null;
            const delay = baseDelay * Math.pow(backoff, attempt - 1);
            await asyncSleep(delay);
        }
    }

    return null;
}