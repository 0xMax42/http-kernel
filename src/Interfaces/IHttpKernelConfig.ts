import type { ResponseDecorator } from '../Types/mod.ts';
import type { IContext } from './IContext.ts';
import type { IHttpErrorHandlers } from './IHttpErrorHandlers.ts';
import type { IRouteBuilderFactory } from './IRouteBuilder.ts';

export interface IHttpKernelConfig<TContext extends IContext = IContext> {
    decorateResponse: ResponseDecorator<TContext>;
    routeBuilderFactory: IRouteBuilderFactory;
    httpErrorHandlers: IHttpErrorHandlers<TContext>;
}
