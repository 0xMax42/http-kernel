import type { Handler, HttpMethod, Middleware } from '../Types/mod.ts';
import type { IContext, IRouteMatcher } from './mod.ts';

/**
 * Represents an internally registered route within the HttpKernel.
 *
 * Contains all data required to match an incoming request and dispatch it
 * through the associated middleware chain and final handler.
 */
export interface IInternalRoute<TContext extends IContext = IContext> {
    /**
     * The HTTP method (e.g. 'GET', 'POST') that this route responds to.
     * The method should always be in uppercase.
     */
    method: HttpMethod;

    /**
     * A matcher function used to determine whether this route matches a given request.
     *
     * If the matcher returns `null`, the route does not apply to the request.
     * If it returns a params object, the route is considered matched and the extracted
     * parameters are passed into the request context.
     *
     * @param url - The parsed URL object from the incoming request.
     * @param req - The original Request object.
     * @returns An object with extracted path parameters, or `null` if not matched.
     */
    matcher: IRouteMatcher;

    /**
     * An ordered list of middleware functions to be executed before the handler.
     */
    middlewares: Middleware<TContext>[];

    /**
     * The final handler that generates the HTTP response after all middleware has run.
     */
    handler: Handler<TContext>;

    /**
     * The fully compiled execution pipeline for this route.
     *
     * This function is generated at route registration time and encapsulates the
     * entire middleware chain as well as the final handler. It is called by the
     * HttpKernel during request dispatch when a route has been matched.
     *
     * Internally, `runRoute` ensures that each middleware is invoked in the correct order
     * and receives a `next()` callback to pass control downstream. The final handler is
     * invoked once all middleware has completed or short-circuited the pipeline.
     *
     * It is guaranteed that:
     * - The function is statically compiled and does not perform dynamic dispatching.
     * - Each middleware can only call `next()` once; repeated invocations will throw.
     * - The return value is either a `Response` or a Promise resolving to one.
     *
     * @param ctx - The context object carrying route, request, response and other scoped data.
     * @returns A `Response` object or a Promise resolving to a `Response`.
     *
     * @throws {Error} If a middleware calls `next()` more than once.
     */
    runRoute: (
        ctx: TContext,
    ) => Promise<Response> | Response;
}
