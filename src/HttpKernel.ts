import {
    IContext,
    IHandler,
    IHttpKernel,
    IHttpKernelConfig,
    IInternalRoute,
    IMiddleware,
    IRouteBuilder,
    IRouteDefinition,
    isHandler,
    isMiddleware,
} from './Interfaces/mod.ts';
import {
    DeepPartial,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HttpStatusTextMap,
} from './Types/mod.ts';
import { RouteBuilder } from './RouteBuilder.ts';
import { createEmptyContext, normalizeError } from './Utils/mod.ts';

/**
 * The central HTTP kernel responsible for managing route definitions,
 * executing middleware chains, and dispatching HTTP requests to their handlers.
 *
 * This class supports a fluent API for route registration and allows the injection
 * of custom response decorators and route builder factories for maximum flexibility and testability.
 */
export class HttpKernel<TContext extends IContext = IContext>
    implements IHttpKernel<TContext> {
    private cfg: IHttpKernelConfig<TContext>;
    /**
     * The list of internally registered routes, each with method, matcher, middleware, and handler.
     */
    private routes: IInternalRoute<TContext>[] = [];

    /**
     * Creates a new instance of the `HttpKernel`.
     *
     * @param decorateResponse - An optional response decorator function that is applied to all responses
     *                           after the middleware/handler pipeline. Defaults to identity (no modification).
     * @param routeBuilderFactory - Optional factory for creating route builders. Defaults to using `RouteBuilder`.
     */
    public constructor(
        config?: DeepPartial<IHttpKernelConfig<TContext>>,
    ) {
        this.cfg = {
            decorateResponse: (res) => res,
            routeBuilderFactory: RouteBuilder,
            httpErrorHandlers: {
                [HTTP_404_NOT_FOUND]: () =>
                    new Response(HttpStatusTextMap[HTTP_404_NOT_FOUND], {
                        status: HTTP_404_NOT_FOUND,
                    }),
                [HTTP_500_INTERNAL_SERVER_ERROR]: () =>
                    new Response(
                        HttpStatusTextMap[HTTP_500_INTERNAL_SERVER_ERROR],
                        {
                            status: HTTP_500_INTERNAL_SERVER_ERROR,
                        },
                    ),
                ...(config?.httpErrorHandlers ?? {}),
            },
            ...config,
        } as IHttpKernelConfig<TContext>;

        this.handle = this.handle.bind(this);
        this.registerRoute = this.registerRoute.bind(this);
    }

    /**
     * @inheritdoc
     */
    public route<_TContext extends IContext = TContext>(
        definition: IRouteDefinition,
    ): IRouteBuilder<_TContext> {
        return new this.cfg.routeBuilderFactory(
            this.registerRoute,
            definition,
        ) as IRouteBuilder<_TContext>;
    }

    /**
     * @inheritdoc
     */ public async handle(
        request: Request,
    ): Promise<Response> {
        const url = new URL(request.url);
        const method = request.method.toUpperCase();

        for (const route of this.routes) {
            if (route.method !== method) continue;
            const match = route.matcher(url, request);
            if (match) {
                const ctx: TContext = {
                    req: request,
                    params: match.params,
                    query: match.query,
                    state: {},
                } as TContext;
                return await this.executePipeline(
                    ctx,
                    route.middlewares,
                    route.handler,
                );
            }
        }

        return this.cfg.httpErrorHandlers[HTTP_404_NOT_FOUND](
            createEmptyContext<TContext>(request),
        );
    }

    /**
     * Registers a finalized route by pushing it into the internal route list.
     *
     * This method is typically called by the route builder after `.handle()` is invoked.
     *
     * @param route - The fully constructed route including matcher, middlewares, and handler.
     */
    private registerRoute<_TContext extends IContext = TContext>(
        route: IInternalRoute<_TContext>,
    ): void {
        this.routes.push(route as unknown as IInternalRoute<TContext>);
    }

    /**
     * Executes the complete request pipeline: middleware chain, final handler, and optional response decoration.
     *
     * Middleware functions are invoked sequentially in the order of registration. Each middleware
     * receives a `next()` callback to advance to the next stage. If a middleware returns a `Response`
     * directly, the pipeline short-circuits.
     *
     * After the final handler produces a response, it is passed through the configured response decorator,
     * which may modify it (e.g., adding headers or logging metadata).
     *
     * Internal error handling ensures:
     * - That `next()` is not called multiple times.
     * - That all middleware and handlers are properly typed.
     * - That thrown exceptions are routed to the 500-error handler.
     *
     * @param ctx - The current request context, including request data and shared state.
     * @param middleware - An ordered list of middleware functions to invoke.
     * @param handler - The terminal request handler to produce the response.
     * @returns The final decorated `Response` object.
     */
    private async executePipeline(
        ctx: TContext,
        middleware: IMiddleware<TContext>[],
        handler: IHandler<TContext>,
    ): Promise<Response> {
        const handleInternalError = (ctx: TContext, err?: unknown) =>
            this.cfg.httpErrorHandlers[HTTP_500_INTERNAL_SERVER_ERROR](
                ctx,
                normalizeError(err),
            );

        let lastIndex = -1;

        const dispatch = async (currentIndex: number): Promise<Response> => {
            // Prevent middleware from invoking next() multiple times
            if (currentIndex <= lastIndex) {
                throw new Error('Middleware called `next()` multiple times');
            }
            lastIndex = currentIndex;

            const isWithinMiddleware = currentIndex < middleware.length;
            const fn = isWithinMiddleware ? middleware[currentIndex] : handler;

            if (isWithinMiddleware) {
                if (!isMiddleware(fn)) {
                    throw new Error(
                        'Expected middleware function, but received invalid value',
                    );
                }
                return await fn(ctx, () => dispatch(currentIndex + 1));
            }

            if (!isHandler(fn)) {
                throw new Error(
                    'Expected request handler, but received invalid value',
                );
            }

            return await fn(ctx);
        };

        try {
            const response = await dispatch(0);
            return this.cfg.decorateResponse(response, ctx);
        } catch (e) {
            return handleInternalError(ctx, e);
        }
    }
}
