import { IContext } from '../Interfaces/mod.ts';

/**
 * A function that modifies or enriches an outgoing HTTP response before it is returned to the client.
 *
 * This decorator can be used to inject headers (e.g., CORS, security), apply global transformations,
 * or wrap responses for logging, analytics, or debugging purposes.
 *
 * It is called exactly once at the end of the middleware/handler pipeline,
 * allowing central response customization without interfering with business logic.
 *
 * @param res - The original `Response` object produced by the route handler or middleware chain.
 * @returns A modified or wrapped `Response` object to be sent back to the client.
 *
 * @example
 * ```ts
 * const addCors: ResponseDecorator = (res) => {
 *   const headers = new Headers(res.headers);
 *   headers.set("Access-Control-Allow-Origin", "*");
 *   return new Response(res.body, {
 *     status: res.status,
 *     headers,
 *   });
 * };
 * ```
 */
export type ResponseDecorator<TContext extends IContext = IContext> = (
    res: Response,
    ctx: TContext,
) => Response;
