import { Handler, Middleware } from '../Types/mod.ts';
import { IContext } from './IContext.ts';
import { IPipelineExecutorConfig } from './IPipelineExecutorConfig.ts';

/**
 * Constructor type for a class implementing the IPipelineExecutor interface.
 *
 * This can be used for dependency injection, factory-based initialization,
 * or dynamic instantiation of pipeline executors.
 *
 * @template TContext - The extended context type passed through the pipeline.
 */
export interface PipelineExecutorFactory<TContext extends IContext = IContext> {
    /**
     * Creates a new instance of a pipeline executor.
     *
     * @param config - Configuration used to control error handling,
     *                 response decoration and lifecycle hooks.
     */
    new (
        config: IPipelineExecutorConfig<TContext>,
    ): IPipelineExecutor<TContext>;
}

/**
 * Defines the contract for executing a middleware and handler pipeline.
 *
 * The pipeline is responsible for:
 * - Executing middleware in order with `next()` chaining
 * - Invoking the final handler
 * - Applying optional lifecycle hooks
 * - Producing and decorating a Response
 *
 * @template TContext - The context type flowing through the pipeline.
 */
export interface IPipelineExecutor<TContext extends IContext = IContext> {
    /**
     * Executes the middleware pipeline and returns the final Response.
     *
     * @param ctx - The context object representing the current HTTP request state.
     * @param middleware - An ordered array of middleware functions to be executed.
     * @param handler - The final route handler to be called after all middleware.
     * @returns A Promise resolving to the final HTTP Response.
     */
    run(
        ctx: TContext,
        middleware: Middleware<TContext>[],
        handler: Handler<TContext>,
    ): Promise<Response>;
}
