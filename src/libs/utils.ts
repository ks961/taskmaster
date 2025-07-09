

export function makeReadonly<T>(obj: T): Readonly<T> {
    return Object.freeze(obj);
}

/**
 * Checks if the application is running in development mode.
 */
export function isInDevelopmentMode() {
    return process.env.NODE_ENV === "development";
}
