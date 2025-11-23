import type { IContext } from '../Interfaces/IContext.ts';
import type { IInternalRoute } from '../Interfaces/mod.ts';

/**
 * A type alias for the internal route registration function used by the `HttpKernel`.
 *
 * This function accepts a fully constructed internal route, including method, matcher,
 * middleware chain, and final handler, and registers it for dispatching.
 *
 * Typically passed into `RouteBuilder` instances to enable fluent API chaining.
 *
 * @template TContext The context type associated with the route being registered.
 */
export type RegisterRoute<TContext extends IContext = IContext> = (
    route: IInternalRoute<TContext>,
) => void;
