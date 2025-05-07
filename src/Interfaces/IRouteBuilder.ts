import { IHandler } from './IHandler.ts';
import { IInternalRoute } from './IInternalRoute.ts';
import { IMiddleware } from './IMiddleware.ts';
import { IRouteDefinition } from './IRouteDefinition.ts';

export interface IRouteBuilderFactory {
    new (
        registerRoute: (route: IInternalRoute) => void,
        def: IRouteDefinition,
        mws?: IMiddleware[],
    ): IRouteBuilder;
}

/**
 * Provides a fluent API to build a single route configuration by chaining
 * middleware and setting the final request handler.
 */
export interface IRouteBuilder {
    /**
     * Adds a middleware to the current route.
     * Middleware will be executed in the order of registration.
     *
     * @param mw - A middleware function.
     * @returns The route builder for further chaining.
     */
    middleware(mw: IMiddleware): IRouteBuilder;

    /**
     * Sets the final request handler for the route.
     * Calling this finalizes the route and registers it in the kernel.
     *
     * @param handler - The function to execute when this route is matched.
     */
    handle(handler: IHandler): void;
}
