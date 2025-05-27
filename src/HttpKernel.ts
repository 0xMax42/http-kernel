import type {
    IContext,
    IHttpKernel,
    IHttpKernelConfig,
    IInternalRoute,
    IRouteBuilder,
    IRouteDefinition,
} from './Interfaces/mod.ts';
import {
    type DeepPartial,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HttpStatusTextMap,
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
                try {
                    const response = await route.runRoute(ctx);
                    return this.cfg.decorateResponse(response, ctx);
                } catch (e) {
                    return await this.handleInternalError(ctx, e);
                }
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

    private handleInternalError = (
        ctx: TContext,
        err?: unknown,
    ): Response | Promise<Response> => {
        return this.cfg.httpErrorHandlers[HTTP_500_INTERNAL_SERVER_ERROR](
            ctx,
            normalizeError(err),
        );
    };
}
