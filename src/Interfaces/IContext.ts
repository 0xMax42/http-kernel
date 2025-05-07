import { Params, Query, State } from '../Types/mod.ts';

/**
 * Represents the complete context for a single HTTP request,
 * passed through the middleware pipeline and to the final route handler.
 *
 * This context object encapsulates all relevant runtime data for a request,
 * including the original request, path parameters, query parameters,
 * and a shared, mutable application state.
 *
 * @template TState  Structured per-request state shared across middlewares and handlers.
 * @template TParams Parsed URL path parameters, typically derived from route templates.
 * @template TQuery  Parsed query string parameters, preserving multi-value semantics.
 */
export interface IContext<
    TState extends State = State,
    TParams extends Params = Params,
    TQuery extends Query = Query,
> {
    /**
     * The original HTTP request object as received by Deno.
     * Contains all standard fields like headers, method, body, etc.
     */
    req: Request;

    /**
     * Route parameters parsed from the URL path, based on route definitions
     * that include dynamic segments (e.g., `/users/:id` → `{ id: "123" }`).
     *
     * These parameters are considered read-only and are set by the router.
     */
    params: TParams;

    /**
     * Query parameters extracted from the request URL's search string.
     *
     * Values may occur multiple times (e.g., `?tag=ts&tag=deno`), and are therefore
     * represented as either a string or an array of strings, depending on occurrence.
     *
     * Use this field to access filters, flags, pagination info, or similar modifiers.
     */
    query: TQuery;

    /**
     * A typed, mutable object used to pass structured data between middlewares and handlers.
     *
     * This object is ideal for sharing validated input, user identity, trace information,
     * or other contextual state throughout the request lifecycle.
     *
     * Type-safe access to fields is ensured by the generic `TState` type.
     */
    state: TState;
}
