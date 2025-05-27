import type { IRouteMatcherFactory } from './Interfaces/IRouteMatcher.ts';
import type {
    IContext,
    IInternalRoute,
    IRouteBuilder,
    IRouteDefinition,
} from './Interfaces/mod.ts';
import { isHandler } from './Types/Handler.ts';
import {
    type Handler,
    isMiddleware,
    type Middleware,
    type RegisterRoute,
} from './Types/mod.ts';
import { createRouteMatcher } from './Utils/createRouteMatcher.ts';

/**
 * Provides a fluent builder interface for defining a single route,
 * including HTTP method, path or matcher, middleware chain and final handler.
 *
 * This builder is stateless and immutable; each chained call returns a new instance.
 */
export class RouteBuilder<TContext extends IContext = IContext>
    implements IRouteBuilder<TContext> {
    /**
     * Constructs a new instance of the route builder.
     *
     * @param registerRoute - A delegate used to register the finalized route definition.
     * @param def - The route definition (static path or dynamic matcher).
     * @param mws - The list of middleware functions collected so far (default: empty).
     */
    constructor(
        private readonly registerRoute: RegisterRoute<TContext>,
        private readonly def: IRouteDefinition,
        private readonly mws: Middleware<TContext>[] = [],
        private readonly matcherFactory: IRouteMatcherFactory =
            createRouteMatcher,
    ) {}

    /**
     * Adds a middleware function to the current route definition.
     *
     * Middleware is executed in the order it is added.
     * Returns a new builder instance with the additional middleware appended.
     *
     * @param mw - A middleware function to be executed before the handler.
     * @returns A new `RouteBuilder` instance for continued chaining.
     */
    middleware(
        mw: Middleware<TContext>,
    ): IRouteBuilder<TContext> {
        return new RouteBuilder<TContext>(
            this.registerRoute,
            this.def,
            [...this.mws, mw],
        );
    }

    /**
     * Finalizes the route by assigning the handler and registering the route.
     *
     * Internally constructs a matcher function from the route definition
     * and passes all route data to the registration delegate.
     *
     * @param handler - The final request handler for this route.
     */
    handle(
        handler: Handler<TContext>,
    ): void {
        const matcher = this.matcherFactory(this.def);
        this.registerRoute({
            method: this.def.method,
            matcher,
            middlewares: this.mws,
            handler: handler,
            runRoute: this.compile({
                middlewares: this.mws,
                handler: handler,
            }),
        });
    }

    /**
     * Compiles the middleware chain and handler into a single executable function.
     *
     * This method constructs a statically linked function chain by reducing all middleware
     * and the final handler into one composed `runRoute` function. Each middleware receives
     * a `next()` callback that invokes the next function in the chain.
     *
     * Additionally, the returned function ensures that `next()` can only be called once
     * per middleware. If `next()` is invoked multiple times within the same middleware,
     * a runtime `Error` is thrown, preventing unintended double-processing.
     *
     * Type safety is enforced at compile time:
     * - If the final handler does not match the expected signature, a `TypeError` is thrown.
     * - If any middleware does not conform to the middleware interface, a `TypeError` is thrown.
     *
     * @param route - A partial route object containing middleware and handler,
     *                excluding `matcher`, `method`, and `runRoute`.
     * @returns A composed route execution function that takes a context object
     *          and returns a `Promise<Response>`.
     *
     * @throws {TypeError} If the handler or any middleware function is invalid.
     * @throws {Error} If a middleware calls `next()` more than once during execution.
     */
    private compile(
        route: Omit<
            IInternalRoute<TContext>,
            'runRoute' | 'matcher' | 'method'
        >,
    ): (
        ctx: TContext,
    ) => Promise<Response> {
        if (!isHandler<TContext>(route.handler)) {
            throw new TypeError(
                'Route handler must be a function returning a Promise<Response>.',
            );
        }
        let composed = route.handler;

        for (let i = route.middlewares.length - 1; i >= 0; i--) {
            if (!isMiddleware<TContext>(route.middlewares[i])) {
                throw new TypeError(
                    `Middleware at index ${i} is not a valid function.`,
                );
            }

            const current = route.middlewares[i];
            const next = composed;

            composed = async (ctx: TContext): Promise<Response> => {
                let called = false;

                return await current(ctx, async () => {
                    if (called) {
                        throw new Error(
                            `next() called multiple times in middleware at index ${i}`,
                        );
                    }
                    called = true;
                    return await next(ctx);
                });
            };
        }

        return composed;
    }
}
