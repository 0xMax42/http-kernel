import { IContext } from '../Interfaces/mod.ts';

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
type Handler<TContext extends IContext = IContext> = (
    ctx: TContext,
) => Promise<Response>;

/**
 * Represents a handler function with an associated name.
 *
 * This is useful for debugging, logging, or when you need to reference
 * the handler by name in your application.
 *
 * @template TContext The specific context type for this handler, including typed `state`, `params`, and `query`.
 */
type NamedHandler<TContext extends IContext = IContext> =
    & Handler<TContext>
    & { name?: string };

export type { NamedHandler as Handler };

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
): value is Handler<TContext> {
    return (
        typeof value === 'function' &&
        value.length === 1 // ctx
    );
}
