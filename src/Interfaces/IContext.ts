/**
 * Represents the per-request context passed through the middleware pipeline and to the final handler.
 *
 * This context object encapsulates the original HTTP request,
 * the path parameters extracted from the matched route,
 * and a mutable state object for sharing information across middlewares and handlers.
 */
export interface IContext {
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
    params: Record<string, string>;

    /**
     * A shared, mutable object used to pass arbitrary data between middlewares and handlers.
     *
     * Use this field to attach validated user info, auth state, logging context, etc.
     *
     * Each key should be well-named to avoid collisions across layers.
     */
    state: Record<string, unknown>;
}
