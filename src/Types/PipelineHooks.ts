import { IContext } from '../Interfaces/mod.ts';

/**
 * A callback invoked when the middleware pipeline starts.
 *
 * @template TContext - The context type passed throughout the pipeline.
 * @param ctx - The context object for the current request.
 */
export type OnPipelineStart<TContext extends IContext> = (
    ctx: TContext,
) => void;

/**
 * A callback invoked immediately before a middleware or handler is executed.
 *
 * @template TContext - The context type passed throughout the pipeline.
 * @param name - Optional name of the current middleware or handler, if defined.
 * @param ctx - The context object for the current request.
 */
export type OnStepStart<TContext extends IContext> = (
    name: string | undefined,
    ctx: TContext,
) => void;

/**
 * A callback invoked immediately after a middleware or handler has completed.
 *
 * @template TContext - The context type passed throughout the pipeline.
 * @param name - Optional name of the current middleware or handler, if defined.
 * @param ctx - The context object for the current request.
 * @param duration - Execution time in milliseconds.
 */
export type OnStepEnd<TContext extends IContext> = (
    name: string | undefined,
    ctx: TContext,
    duration: number,
) => void;

/**
 * A callback invoked after the entire pipeline has completed execution.
 *
 * @template TContext - The context type passed throughout the pipeline.
 * @param ctx - The context object for the current request.
 * @param totalDuration - Total execution time of the pipeline in milliseconds.
 */
export type OnPipelineEnd<TContext extends IContext> = (
    ctx: TContext,
    totalDuration: number,
) => void;
