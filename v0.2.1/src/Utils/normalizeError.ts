/**
 * Normalizes any thrown value to a proper `Error` instance.
 *
 * This is useful when handling unknown thrown values that may be:
 * - strings (e.g. `throw "oops"`)
 * - numbers (e.g. `throw 404`)
 * - objects that are not instances of `Error`
 *
 * Ensures that downstream error handling logic always receives a consistent `Error` object.
 *
 * @param unknownError - Any value that might have been thrown.
 * @returns A valid `Error` instance wrapping the original input.
 *
 * @example
 * ```ts
 * try {
 *   throw "something went wrong";
 * } catch (e) {
 *   const err = normalizeError(e);
 *   console.error(err.message); // "something went wrong"
 * }
 * ```
 */
export function normalizeError(unknownError: unknown): Error {
    return unknownError instanceof Error ? unknownError : new Error(
        typeof unknownError === 'string'
            ? unknownError
            : JSON.stringify(unknownError),
    );
}
