import { Handler, HttpMethod, Middleware } from '../Types/mod.ts';
import { IContext, IRouteMatcher } from './mod.ts';

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
}
