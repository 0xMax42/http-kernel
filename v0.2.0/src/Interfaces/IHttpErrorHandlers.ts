import type { IContext } from '../Interfaces/mod.ts';
import type { HttpErrorHandler, validHttpErrorCodes } from '../Types/mod.ts';

/**
 * A mapping of HTTP status codes to their corresponding error handlers.
 *
 * This interface defines required handlers for common critical status codes (404 and 500)
 * and allows optional handlers for all other known error codes defined in `validHttpErrorCodes`.
 *
 * This hybrid approach ensures predictable handling for key failure cases,
 * while remaining flexible for less common codes.
 *
 * @template TContext - The context type used in all error handlers.
 *
 * @example
 * ```ts
 * const errorHandlers: IHttpErrorHandlers = {
 *   404: (ctx) => new Response("Not Found", { status: 404 }),
 *   500: (ctx, err) => {
 *     console.error(err);
 *     return new Response("Internal Server Error", { status: 500 });
 *   },
 *   429: (ctx) => new Response("Too Many Requests", { status: 429 }),
 * };
 * ```
 */
export interface IHttpErrorHandlers<TContext extends IContext = IContext>
    extends
        Partial<
            Record<
                Exclude<typeof validHttpErrorCodes[number], 404 | 500>,
                HttpErrorHandler<TContext>
            >
        > {
    /** Required error handler for HTTP 404 (Not Found). */
    404: HttpErrorHandler<TContext>;

    /** Required error handler for HTTP 500 (Internal Server Error). */
    500: HttpErrorHandler<TContext>;
}
