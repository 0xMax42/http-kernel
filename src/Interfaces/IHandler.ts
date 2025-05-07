import { IContext } from './IContext.ts';

/**
 * Represents a final request handler responsible for generating a response.
 *
 * The handler is the last step in the middleware pipeline and must return
 * a valid HTTP `Response`. It has access to all data injected into the
 * request context, including path parameters and any state added by middleware.
 */
export interface IHandler {
    /**
     * @param ctx - The complete request context, including parameters and middleware state.
     * @returns A promise resolving to an HTTP `Response`.
     */
    (ctx: IContext): Promise<Response>;
}
