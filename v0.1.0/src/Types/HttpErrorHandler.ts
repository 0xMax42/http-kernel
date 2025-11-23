import { IContext } from '../Interfaces/mod.ts';

/**
 * Defines a handler function for errors that occur during the execution
 * of middleware or route handlers within the HTTP kernel.
 *
 * This function receives both the request context and the thrown error,
 * and is responsible for producing an appropriate HTTP `Response`.
 *
 * Typical use cases include:
 * - Mapping known error types to specific HTTP status codes.
 * - Generating structured error responses (e.g. JSON error payloads).
 * - Logging errors centrally with request metadata.
 *
 * The handler may return the response synchronously or asynchronously.
 *
 * @template TContext - The specific request context type, allowing typed access to route parameters,
 *                      query parameters, and per-request state when formatting error responses.
 *
 * @param context - The active request context at the time the error occurred.
 * @param error - The exception or error that was thrown during request processing.
 *
 * @returns A `Response` object or a `Promise` resolving to one, to be sent to the client.
 */
export type HttpErrorHandler<TContext extends IContext = IContext> = (
    context?: Partial<TContext>,
    error?: Error,
) => Promise<Response> | Response;
