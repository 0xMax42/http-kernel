import { Query } from '../Types/Query.ts';

/**
 * Parses a `URLSearchParams` object into an `IQuery` structure
 * that preserves both single and multi-value semantics.
 *
 * For each query parameter key, this function checks how often the key appears:
 * - If the key occurs once, the value is stored as a string.
 * - If the key occurs multiple times, the values are stored as a string array.
 *
 * This ensures compatibility with the `IQuery` type definition,
 * which allows both `string` and `string[]` as value types.
 *
 * Example:
 *   - ?tag=deno&tag=ts    →  { tag: ["deno", "ts"] }
 *   - ?page=2             →  { page: "2" }
 *
 * @param searchParams - The `URLSearchParams` instance from a parsed URL.
 * @returns An object conforming to `IQuery`, with normalized parameter values.
 */
export function parseQuery(searchParams: URLSearchParams): Query {
    const query: Query = {};

    for (const key of new Set(searchParams.keys())) {
        const values = searchParams.getAll(key);
        query[key] = values.length > 1 ? values : values[0];
    }

    return query;
}
