/**
 * A constant list of all supported HTTP methods according to RFC 7231 and RFC 5789.
 *
 * This array serves both as a runtime value list for validation
 * and as the basis for deriving the `HttpMethod` union type.
 *
 * Note: The list is immutable and should not be modified at runtime.
 */
export const validHttpMethods = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS',
] as const;

/**
 * A union type representing all valid HTTP methods recognized by this application.
 *
 * This type is derived directly from the `validHttpMethods` constant,
 * ensuring type safety and consistency between type system and runtime checks.
 *
 * Example:
 * ```ts
 * const method: HttpMethod = 'POST'; // ✅ valid
 * const method: HttpMethod = 'FOO';  // ❌ Type error
 * ```
 */
export type HttpMethod = typeof validHttpMethods[number];

/**
 * Type guard to verify whether a given value is a valid HTTP method.
 *
 * This function checks both the type and content of the value
 * and is suitable for runtime validation of inputs (e.g., from HTTP requests).
 *
 * Example:
 * ```ts
 * if (isHttpMethod(input)) {
 *   // input is now typed as HttpMethod
 * }
 * ```
 *
 * @param value - The value to test (typically a string from a request).
 * @returns `true` if the value is a valid `HttpMethod`, otherwise `false`.
 */
export function isHttpMethod(value: unknown): value is HttpMethod {
    return typeof value === 'string' &&
        validHttpMethods.includes(value as HttpMethod);
}
