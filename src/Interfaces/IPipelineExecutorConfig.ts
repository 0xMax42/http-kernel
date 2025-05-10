import { ResponseDecorator } from '../Types/ResponseDecorator.ts';
import { IContext } from './IContext.ts';
import { IHttpErrorHandlers } from './IHttpErrorHandlers.ts';
import { IPipelineHooks } from './IPipelineHooks.ts';

/**
 * Configuration object for the PipelineExecutor, defining how to handle
 * errors, responses, and tracing hooks.
 *
 * This allows the execution logic to remain decoupled from kernel-level behavior
 * while still supporting custom behavior injection.
 *
 * @template TContext - The context type propagated during pipeline execution.
 */
export interface IPipelineExecutorConfig<TContext extends IContext = IContext> {
    /**
     * Optional function used to transform or decorate the final Response object
     * before it is returned to the client.
     */
    decorateResponse?: ResponseDecorator<TContext>;

    /**
     * Optional map of error handlers, keyed by HTTP status codes (e.g., 404, 500).
     * These handlers are invoked if an error occurs during middleware or handler execution.
     */
    errorHandlers?: IHttpErrorHandlers<TContext>;

    /**
     * Optional hooks that allow tracing and lifecycle monitoring during pipeline execution.
     * Each hook is called at a specific phase of the middleware/handler lifecycle.
     */
    pipelineHooks?: IPipelineHooks<TContext>;
}
