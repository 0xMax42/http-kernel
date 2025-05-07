import { HttpMethod } from '../Types/mod.ts';
import { IRouteMatcher } from './IRouteMatcher.ts';

/**
 * Defines a static route using a path pattern with optional parameters.
 *
 * Suitable for conventional routes like "/users/:id", which can be parsed
 * into named parameters using a path-matching library.
 */
export interface IStaticRouteDefinition {
    /**
     * The HTTP method this route should match (e.g. "GET", "POST").
     */
    method: HttpMethod;

    /**
     * A static path pattern for the route, which may include named parameters
     * (e.g. "/caches/:id"). Internally, this can be converted to a regex matcher.
     */
    path: string;
}

/**
 * Defines a dynamic route using a custom matcher function instead of a static path.
 *
 * Useful for complex URL structures that cannot easily be expressed using a static pattern,
 * such as routes with variable prefixes or conditional segment logic.
 */
export interface IDynamicRouteDefinition {
    /**
     * The HTTP method this route should match (e.g. "GET", "POST").
     */
    method: HttpMethod;

    /**
     * A custom matcher function that receives the parsed URL and raw request.
     * If the function returns `null`, the route does not match.
     * If the function returns a params object, the route is considered matched.
     */
    matcher: IRouteMatcher;
}

/**
 * A route definition can either be a conventional static route with a path pattern,
 * or a dynamic route with a custom matcher function for advanced matching logic.
 */
export type IRouteDefinition = IStaticRouteDefinition | IDynamicRouteDefinition;
