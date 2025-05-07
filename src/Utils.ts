import { IRouteDefinition, IRouteMatcher } from './Interfaces/mod.ts';

/**
 * Creates a matcher function from a given route definition.
 *
 * This utility supports both static path-based route definitions (e.g. `/users/:id`)
 * and custom matcher functions for dynamic routing scenarios.
 *
 * ### Static Path Example
 * For a definition like:
 * ```ts
 * { method: "GET", path: "/users/:id" }
 * ```
 * the returned matcher function will:
 * - match requests to `/users/123`
 * - extract `{ id: "123" }` as `params`
 *
 * ### Dynamic Matcher Example
 * If the `IRouteDefinition` includes a `matcher` function, it will be used as-is.
 *
 * @param def - The route definition to convert into a matcher function.
 *              Can be static (`path`) or dynamic (`matcher`).
 *
 * @returns A matcher function that receives a `URL` and `Request` and returns:
 * - `{ params: Record<string, string> }` if the route matches
 * - `null` if the route does not match the request
 *
 * @example
 * ```ts
 * const matcher = createRouteMatcher({ method: "GET", path: "/repo/:owner/:name" });
 * const result = matcher(new URL("http://localhost/repo/foo/bar"), req);
 * // result: { params: { owner: "foo", name: "bar" } }
 * ```
 */
export function createRouteMatcher(
    def: IRouteDefinition,
): IRouteMatcher {
    if ('matcher' in def) {
        return def.matcher;
    } else {
        const pattern = def.path;
        const keys: string[] = [];
        const regex = new RegExp(
            '^' +
                pattern.replace(/:[^\/]+/g, (m) => {
                    keys.push(m.substring(1));
                    return '([^/]+)';
                }) +
                '$',
        );
        return (url: URL) => {
            const match = url.pathname.match(regex);
            if (!match) return null;
            const params: Record<string, string> = {};
            for (let i = 0; i < keys.length; i++) {
                params[keys[i]] = decodeURIComponent(match[i + 1]);
            }
            return { params };
        };
    }
}
