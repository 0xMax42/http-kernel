import { IContext } from './IContext.ts';

/**
 * Represents a final request handler responsible for producing an HTTP response.
 *
 * The handler is the terminal stage of the middleware pipeline and is responsible
 * for processing the incoming request and generating the final `Response`.
 *
 * It receives the fully-typed request context, which includes the original request,
 * parsed route parameters, query parameters, and any shared state populated by prior middleware.
 *
 * @template TContext The specific context type for this handler, including typed `state`, `params`, and `query`.
 */
export interface IHandler<TContext extends IContext = IContext> {
    /**
     * Handles the request and generates a response.
     *
     * @param ctx - The complete request context, including request metadata, route and query parameters,
     *              and mutable state populated during the middleware phase.
     * @returns A `Promise` resolving to an HTTP `Response` to be sent to the client.
     */
    (ctx: TContext): Promise<Response>;
}
