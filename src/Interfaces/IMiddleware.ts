import { IContext } from './IContext.ts';

/**
 * Represents a middleware function in the HTTP request pipeline.
 *
 * Middleware can perform tasks such as logging, authentication, validation,
 * or response transformation. It receives the current request context and
 * a `next()` function to delegate control to the next middleware or final handler.
 *
 * To stop the request pipeline, a middleware can return a `Response` directly
 * without calling `next()`.
 */
export interface IMiddleware {
    /**
     * @param ctx - The request context, containing the request, path parameters, and shared state.
     * @param next - A function that continues the middleware pipeline. Returns the final `Response`.
     * @returns A promise resolving to an HTTP `Response`.
     */
    (ctx: IContext, next: () => Promise<Response>): Promise<Response>;
}
