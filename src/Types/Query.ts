/**
 * Represents the parsed query parameters from the request URL.
 *
 * Query parameters originate from the URL search string (e.g. `?filter=active&tags=ts&tags=deno`)
 * and may contain single or multiple values per key.
 *
 * All values are expressed as strings or arrays of strings, depending on how often
 * the key occurs. This structure preserves the raw semantics of the query.
 *
 * For normalized single-value access, prefer custom DTOs or wrapper utilities.
 */
export type Query = Record<string, string | string[]>;
