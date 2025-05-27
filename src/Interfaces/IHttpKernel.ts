import type { IContext } from './IContext.ts';
import type { IRouteBuilder } from './IRouteBuilder.ts';
import type { IRouteDefinition } from './IRouteDefinition.ts';

/**
 * The `IHttpKernel` interface defines the public API for a type-safe, middleware-driven HTTP dispatching system.
 *
 * Implementations of this interface are responsible for:
 * - Registering routes with optional per-route context typing
 * - Handling incoming requests by matching and dispatching to appropriate handlers
 * - Managing the complete middleware pipeline and final response generation
 *
 * The kernel operates on a customizable `IContext` type to support strongly typed request parameters, state,
 * and query values across the entire routing lifecycle.
 *
 * @typeParam TContext - The default context type used for all routes unless overridden per-route.
 */
export interface IHttpKernel<TContext extends IContext = IContext> {
    /**
     * Registers a new HTTP route (static or dynamic) and returns a route builder for middleware/handler chaining.
     *
     * This method supports contextual polymorphism via the `_TContext` type parameter, enabling fine-grained
     * typing of route-specific `params`, `query`, and `state` values. The route is not registered until
     * `.handle()` is called on the returned builder.
     *
     * @typeParam _TContext - An optional override for the context type specific to this route.
     *                        Falls back to the global `TContext` of the kernel if omitted.
     *
     * @param definition - A route definition specifying the HTTP method and path or custom matcher.
     * @returns A fluent builder interface to define middleware and attach a final handler.
     */
    route<_TContext extends IContext = TContext>(
        definition: IRouteDefinition,
    ): IRouteBuilder<_TContext>;

    /**
     * Handles an incoming HTTP request and produces a `Response`.
     *
     * The kernel matches the request against all registered routes by method and matcher,
     * constructs a typed context, and executes the middleware/handler pipeline.
     * If no route matches, a 404 error handler is invoked.
     *
     * This method is designed to be passed directly to `Deno.serve()` or similar server frameworks.
     *
     * @param request - The incoming HTTP request object.
     * @returns A `Promise` resolving to a complete HTTP response.
     */
    handle(request: Request): Promise<Response>;
}
