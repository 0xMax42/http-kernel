import {
    IContext,
    IHandler,
    IHttpKernel,
    IInternalRoute,
    IMiddleware,
    IRouteBuilder,
    IRouteBuilderFactory,
    IRouteDefinition,
    ResponseDecorator,
} from './Interfaces/mod.ts';
import { RouteBuilder } from './RouteBuilder.ts';

/**
 * The central HTTP kernel responsible for managing route definitions,
 * executing middleware chains, and dispatching HTTP requests to their handlers.
 *
 * This class supports a fluent API for route registration and allows the injection
 * of custom response decorators and route builder factories for maximum flexibility and testability.
 */
export class HttpKernel implements IHttpKernel {
    /**
     * The list of internally registered routes, each with method, matcher, middleware, and handler.
     */
    private routes: IInternalRoute[] = [];

    /**
     * Creates a new instance of the `HttpKernel`.
     *
     * @param decorateResponse - An optional response decorator function that is applied to all responses
     *                           after the middleware/handler pipeline. Defaults to identity (no modification).
     * @param routeBuilderFactory - Optional factory for creating route builders. Defaults to using `RouteBuilder`.
     */
    public constructor(
        private readonly decorateResponse: ResponseDecorator = (res) => res,
        private readonly routeBuilderFactory: IRouteBuilderFactory =
            RouteBuilder,
    ) {}

    /**
     * @inheritdoc
     */
    public route(definition: IRouteDefinition): IRouteBuilder {
        return new this.routeBuilderFactory(
            this.registerRoute.bind(this),
            definition,
        );
    }

    /**
     * @inheritdoc
     */
    public handle = async (request: Request): Promise<Response> => {
        const url = new URL(request.url);
        const method = request.method.toUpperCase();

        for (const route of this.routes) {
            if (route.method !== method) continue;
            const match = route.matcher(url, request);
            if (match) {
                const ctx: IContext = {
                    req: request,
                    params: match.params,
                    state: {},
                };
                return await this.executePipeline(
                    ctx,
                    route.middlewares,
                    route.handler,
                );
            }
        }

        return new Response('Not Found', { status: 404 });
    };

    /**
     * Registers a finalized route by pushing it into the internal route list.
     *
     * This method is typically called by the route builder after `.handle()` is invoked.
     *
     * @param route - The fully constructed route including matcher, middlewares, and handler.
     */
    private registerRoute(route: IInternalRoute): void {
        this.routes.push(route);
    }

    /**
     * Executes the middleware pipeline and final handler for a given request context.
     *
     * This function recursively invokes middleware in the order they were registered,
     * ending with the route's final handler. If a middleware returns a response directly
     * without calling `next()`, the pipeline is short-circuited.
     *
     * The final response is passed through the `decorateResponse` function before being returned.
     *
     * @param ctx - The request context containing the request, parameters, and shared state.
     * @param middleware - The ordered list of middleware to apply before the handler.
     * @param handler - The final request handler to invoke at the end of the pipeline.
     * @returns The final HTTP response after middleware and decoration.
     */
    private async executePipeline(
        ctx: IContext,
        middleware: IMiddleware[],
        handler: IHandler,
    ): Promise<Response> {
        let i = -1;
        const dispatch = async (index: number): Promise<Response> => {
            if (index <= i) throw new Error('next() called multiple times');
            i = index;
            const fn: IMiddleware | IHandler = index < middleware.length
                ? middleware[index]
                : handler;
            if (!fn) return new Response('Internal error', { status: 500 });
            return index < middleware.length
                ? await fn(ctx, () => dispatch(index + 1))
                : await (fn as IHandler)(ctx);
        };
        return this.decorateResponse(await dispatch(0));
    }
}
