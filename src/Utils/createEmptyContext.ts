import { IContext } from '../Interfaces/mod.ts';
import { Params, Query, State } from '../Types/mod.ts';

/**
 * Creates an empty request context suitable for fallback handlers (e.g., 404 or 500 errors).
 *
 * This function is primarily intended for cases where no route matched, but a context-compatible
 * object is still needed to invoke a generic error handler. All context fields are initialized
 * to their default empty values (`{}` for params, query, and state).
 *
 * @template TContext - The expected context type, typically extending `IContext`.
 * @param req - The original HTTP request object from `Deno.serve()`.
 * @returns A minimal context object compatible with `TContext`.
 *
 * @example
 * ```ts
 * const ctx = createEmptyContext<MyContext>(request);
 * return httpErrorHandlers[404](ctx);
 * ```
 */
export function createEmptyContext<TContext extends IContext = IContext>(
    req: Request,
): TContext {
    return {
        req,
        params: {} as Params,
        query: {} as Query,
        state: {} as State,
    } as TContext;
}
