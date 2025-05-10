import {
    OnPipelineEnd,
    OnPipelineStart,
    OnStepEnd,
    OnStepStart,
} from '../Types/mod.ts';
import { IContext } from './IContext.ts';

/**
 * A set of optional hook functions that can be triggered during pipeline execution.
 * These hooks allow tracing, performance measurement, and logging to be integrated
 * without altering middleware or handler logic.
 *
 * @template TContext - The custom context type used within the application.
 */
export interface IPipelineHooks<TContext extends IContext = IContext> {
    /**
     * Triggered once before any middleware or handler is executed.
     */
    onPipelineStart?: OnPipelineStart<TContext>;

    /**
     * Triggered immediately before each middleware or handler runs.
     */
    onStepStart?: OnStepStart<TContext>;

    /**
     * Triggered immediately after each middleware or handler has finished executing.
     */
    onStepEnd?: OnStepEnd<TContext>;

    /**
     * Triggered after the entire pipeline completes execution.
     */
    onPipelineEnd?: OnPipelineEnd<TContext>;
}
