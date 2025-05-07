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

/**
 * Type guard to determine whether a given value is a valid `IHandler` function.
 *
 * This function checks whether the input is a function and whether it returns
 * a `Promise<Response>` when called. Due to TypeScript's structural typing and
 * the lack of runtime type information, only minimal runtime validation is possible.
 *
 * @param value - The value to test.
 * @returns `true` if the value is a function that appears to conform to `IHandler`.
 *
 * @example
 * ```ts
 * const candidate = async (ctx: IContext) => new Response("ok");
 * if (isHandler(candidate)) {
 *   // candidate is now typed as IHandler<IContext>
 * }
 * ```
 */
export function isHandler<TContext extends IContext = IContext>(
    value: unknown,
): value is IHandler<TContext> {
    return (
        typeof value === 'function' &&
        value.length === 1 // ctx
    );
}
