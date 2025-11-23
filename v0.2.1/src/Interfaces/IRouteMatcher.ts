import type { IRouteDefinition } from './IRouteDefinition.ts';
import type { IRouteMatch } from './IRouteMatch.ts';

/**
 * Defines a route matcher function that evaluates whether a route applies to a given request.
 *
 * If the route matches, the matcher returns an object containing extracted route parameters.
 * Otherwise, it returns `null`.
 */
export interface IRouteMatcher {
    /**
     * Evaluates whether the given URL and request match a defined route.
     *
     * @param url - The full URL of the incoming request.
     * @param req - The raw Request object (may be used for context or headers).
     * @returns An object containing path parameters if matched, or `null` if not matched.
     */
    (url: URL, req: Request): null | IRouteMatch;
}

/**
 * Represents a factory for creating route matcher functions from route definitions.
 *
 * This allows the matcher logic to be injected or replaced (e.g. for testing,
 * pattern libraries, or advanced routing scenarios).
 */
export interface IRouteMatcherFactory {
    /**
     * Creates a matcher function based on a given route definition.
     *
     * @param def - The route definition (static or dynamic).
     * @returns A matcher function that checks if a request matches and extracts parameters.
     */
    (def: IRouteDefinition): IRouteMatcher;
}
