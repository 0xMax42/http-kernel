import { IContext } from './IContext.ts';

/**
 * Represents a middleware function in the HTTP request pipeline.
 *
 * Middleware is a core mechanism to intercept, observe, or modify the request lifecycle.
 * It can be used for tasks such as logging, authentication, input validation,
 * metrics collection, or response transformation.
 *
 * Each middleware receives a fully-typed request context and a `next()` function
 * to invoke the next stage of the pipeline. Middleware may choose to short-circuit
 * the pipeline by returning a `Response` early.
 *
 * @template TContext The specific context type for this middleware, including state, params, and query information.
 */
export interface IMiddleware<TContext extends IContext = IContext> {
    /**
     * Handles the request processing at this middleware stage.
     *
     * @param ctx - The full request context, containing request, params, query, and typed state.
     * @param next - A continuation function that executes the next middleware or handler in the pipeline.
     * @returns A `Promise` resolving to an HTTP `Response`, either from this middleware or downstream.
     */
    (ctx: TContext, next: () => Promise<Response>): Promise<Response>;
}

/**
 * Type guard to verify whether a given value is a valid `IMiddleware` function.
 *
 * This guard checks whether the input is a function that accepts exactly two arguments.
 * Note: This is a structural check and cannot fully guarantee the semantics of a middleware.
 *
 * @param value - The value to test.
 * @returns `true` if the value is structurally a valid middleware function.
 */
export function isMiddleware<TContext extends IContext = IContext>(
    value: unknown,
): value is IMiddleware<TContext> {
    return (
        typeof value === 'function' &&
        value.length === 2 // ctx, next
    );
}
