import { IContext } from './IContext.ts';
import { IRouteBuilder } from './IRouteBuilder.ts';
import { IRouteDefinition } from './IRouteDefinition.ts';

/**
 * Defines the core interface for an HTTP kernel instance, responsible for
 * registering routes, orchestrating middleware pipelines, and dispatching
 * incoming HTTP requests to the appropriate handler.
 *
 * The kernel operates on a generic `IContext` type, which encapsulates the
 * request, typed state, route parameters, and query parameters for each request.
 *
 * @template TContext The default context type for all registered routes and handlers.
 */
export interface IHttpKernel<TContext extends IContext = IContext> {
    /**
     * Registers a new route using a static path or custom matcher.
     *
     * Returns a route builder that allows chaining middleware and assigning a final handler.
     * This method is context-generic, allowing temporary overrides for specific routes
     * if their context differs from the kernel-wide default.
     *
     * @template _TContext Optional context override for the specific route being registered.
     *                     Defaults to the kernel's generic `TContext`.
     *
     * @param definition - A route definition containing the HTTP method and either a path
     *                     pattern (e.g., `/users/:id`) or a custom matcher function.
     * @returns A fluent builder interface for attaching middleware and setting the handler.
     */
    route<_TContext extends IContext = TContext>(
        definition: IRouteDefinition,
    ): IRouteBuilder; // IRouteBuilder<_TContext>

    /**
     * Handles an incoming HTTP request by matching it to a route, executing its middleware,
     * and invoking the final handler. Automatically populates route parameters (`ctx.params`),
     * query parameters (`ctx.query`), and initializes an empty mutable state (`ctx.state`).
     *
     * This method is typically passed directly to `Deno.serve()` as the request handler.
     *
     * @template _TContext Optional override for the context type of the current request.
     *                     Useful for testing or simulated requests. Defaults to the kernel’s `TContext`.
     *
     * @param request - The incoming HTTP request to dispatch.
     * @returns A promise resolving to the final HTTP response.
     */
    handle<_TContext extends IContext = TContext>(
        request: Request,
    ): Promise<Response>;
}
