import type { IContext } from '../Interfaces/IContext.ts';

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
type Middleware<TContext extends IContext = IContext> = (
    ctx: TContext,
    next: () => Promise<Response>,
) => Promise<Response>;

/**
 * Represents a middleware function with an associated name.
 *
 * This is useful for debugging, logging, or when you need to reference
 * the middleware by name in your application.
 *
 * @template TContext The specific context type for this middleware, including state, params, and query information.
 */
type NamedMiddleware<TContext extends IContext = IContext> =
    & Middleware<TContext>
    & { name?: string };

export type { NamedMiddleware as Middleware };

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
): value is Middleware<TContext> {
    return (
        typeof value === 'function' &&
        value.length === 2 // ctx, next
    );
}
