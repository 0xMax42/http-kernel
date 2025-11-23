import {
    IContext,
    IHttpKernel,
    IHttpKernelConfig,
    IInternalRoute,
    IRouteBuilder,
    IRouteDefinition,
} from './Interfaces/mod.ts';
import {
    DeepPartial,
    Handler,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HttpStatusTextMap,
    isHandler,
    isMiddleware,
    Middleware,
} from './Types/mod.ts';
import { RouteBuilder } from './RouteBuilder.ts';
import { createEmptyContext, normalizeError } from './Utils/mod.ts';

/**
 * The `HttpKernel` is the central routing engine that manages the full HTTP request lifecycle.
 *
 * It enables:
 * - Dynamic and static route registration via a fluent API
 * - Execution of typed middleware chains and final route handlers
 * - Injection of response decorators and factory overrides
 * - Fine-grained error handling via typed status-code-based handlers
 *
 * The kernel is designed with generics for flexible context typing, strong type safety,
 * and a clear extension point for advanced routing, DI, or tracing logic.
 *
 * @typeParam TContext - The global context type used for all requests handled by this kernel.
 */
export class HttpKernel<TContext extends IContext = IContext>
    implements IHttpKernel<TContext> {
    private cfg: IHttpKernelConfig<TContext>;

    /**
     * The list of registered route definitions, including method, matcher,
     * middleware pipeline, and final handler.
     */
    private routes: IInternalRoute<TContext>[] = [];

    /**
     * Initializes the `HttpKernel` with optional configuration overrides.
     *
     * Default components such as the route builder factory, response decorator,
     * and 404/500 error handlers can be replaced by injecting a partial config.
     * Any omitted values fall back to sensible defaults.
     *
     * @param config - Partial kernel configuration. Missing fields are filled with defaults.
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
     */
    public async handle(request: Request): Promise<Response> {
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
     * Finalizes and registers a route within the kernel.
     *
     * This method is invoked internally by the route builder once
     * `.handle()` is called. It appends the route to the internal list.
     *
     * @param route - A fully constructed internal route object.
     */
    private registerRoute<_TContext extends IContext = TContext>(
        route: IInternalRoute<_TContext>,
    ): void {
        this.routes.push(route as unknown as IInternalRoute<TContext>);
    }

    /**
     * Executes the middleware and handler pipeline for a matched route.
     *
     * This function:
     * - Enforces linear middleware execution with `next()` tracking
     * - Validates middleware and handler types at runtime
     * - Applies the optional response decorator post-processing
     * - Handles all runtime errors via the configured 500 handler
     *
     * @param ctx - The active request context passed to middleware and handler.
     * @param middleware - Ordered middleware functions for this route.
     * @param handler - The final handler responsible for generating a response.
     * @returns The final HTTP `Response`, possibly decorated.
     */
    private async executePipeline(
        ctx: TContext,
        middleware: Middleware<TContext>[],
        handler: Handler<TContext>,
    ): Promise<Response> {
        const handleInternalError = (ctx: TContext, err?: unknown) =>
            this.cfg.httpErrorHandlers[HTTP_500_INTERNAL_SERVER_ERROR](
                ctx,
                normalizeError(err),
            );

        let lastIndex = -1;

        const dispatch = async (currentIndex: number): Promise<Response> => {
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
