// createRouteMatcher.ts

import {
    type IRouteDefinition,
    type IRouteMatch,
    type IRouteMatcher,
    isDynamicRouteDefinition,
} from '../Interfaces/mod.ts';
import type { Params, Query } from '../Types/mod.ts';

/**
 * Transforms a route definition into a matcher using Deno's URLPattern API.
 *
 * @param def - Static path pattern or custom matcher.
 * @returns IRouteMatcher that returns `{ params, query }` or `null`.
 */
export function createRouteMatcher(
    def: IRouteDefinition,
): IRouteMatcher {
    // 1. Allow users to provide their own matcher
    if (isDynamicRouteDefinition(def)) {
        return def.matcher;
    }

    // 2. Build URLPattern; supports :id, *wildcards, regex groups, etc.
    const pattern = new URLPattern({ pathname: def.path });

    // 3. The actual matcher closure
    return (url: URL): IRouteMatch | null => {
        const result = pattern.exec(url);

        // 3a. Path did not match
        if (!result) return null;

        // 3b. Extract route params
        const params: Params = {};
        for (const [key, value] of Object.entries(result.pathname.groups)) {
            if (value) {
                params[key] = value;
            }
        }

        // 3c. Extract query parameters – keep duplicates as arrays
        const query: Query = {};
        for (const key of url.searchParams.keys()) {
            const values = url.searchParams.getAll(key); // → string[]
            query[key] = values.length === 1
                ? values[0] // single → "foo"
                : values; // multi  → ["foo","bar"]
        }

        return { params, query };
    };
}
