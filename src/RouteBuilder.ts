import { IRouteMatcherFactory } from './Interfaces/IRouteMatcher.ts';
import {
    IHandler,
    IInternalRoute,
    IMiddleware,
    IRouteBuilder,
    IRouteDefinition,
} from './Interfaces/mod.ts';
import { createRouteMatcher } from './Utils.ts';

/**
 * Provides a fluent builder interface for defining a single route,
 * including HTTP method, path or matcher, middleware chain and final handler.
 *
 * This builder is stateless and immutable; each chained call returns a new instance.
 */
export class RouteBuilder implements IRouteBuilder {
    /**
     * Constructs a new instance of the route builder.
     *
     * @param registerRoute - A delegate used to register the finalized route definition.
     * @param def - The route definition (static path or dynamic matcher).
     * @param mws - The list of middleware functions collected so far (default: empty).
     */
    constructor(
        private readonly registerRoute: (route: IInternalRoute) => void,
        private readonly def: IRouteDefinition,
        private readonly mws: IMiddleware[] = [],
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
    middleware(mw: IMiddleware): IRouteBuilder {
        return new RouteBuilder(this.registerRoute, this.def, [
            ...this.mws,
            mw,
        ]);
    }

    /**
     * Finalizes the route by assigning the handler and registering the route.
     *
     * Internally constructs a matcher function from the route definition
     * and passes all route data to the registration delegate.
     *
     * @param handler - The final request handler for this route.
     */
    handle(handler: IHandler): void {
        const matcher = this.matcherFactory(this.def);
        this.registerRoute({
            method: this.def.method.toUpperCase(),
            matcher,
            middlewares: this.mws,
            handler,
        });
    }
}
