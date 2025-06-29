import type { Handler, Middleware } from '../Types/mod.ts';
import type { IInternalRoute } from './IInternalRoute.ts';
import type { IRouteDefinition } from './IRouteDefinition.ts';
import type { IContext } from './mod.ts';

export interface IRouteBuilderFactory<TContext extends IContext = IContext> {
    new (
        registerRoute: (route: IInternalRoute<TContext>) => void,
        def: IRouteDefinition,
        mws?: Middleware<TContext>[],
    ): IRouteBuilder<TContext>;
}

/**
 * Provides a fluent API to build a single route configuration by chaining
 * middleware and setting the final request handler.
 */
export interface IRouteBuilder<TContext extends IContext = IContext> {
    /**
     * Adds a middleware to the current route.
     * Middleware will be executed in the order of registration.
     *
     * @param mw - A middleware function.
     * @returns The route builder for further chaining.
     */
    middleware(
        mw: Middleware<TContext>,
    ): IRouteBuilder<TContext>;

    /**
     * Sets the final request handler for the route.
     * Calling this finalizes the route and registers it in the kernel.
     *
     * @param handler - The function to execute when this route is matched.
     */
    handle(
        handler: Handler<TContext>,
    ): void;
}
