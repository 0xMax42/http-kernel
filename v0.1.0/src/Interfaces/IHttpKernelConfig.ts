import { ResponseDecorator } from '../Types/mod.ts';
import { IContext } from './IContext.ts';
import { IHttpErrorHandlers } from './IHttpErrorHandlers.ts';
import { IRouteBuilderFactory } from './IRouteBuilder.ts';

export interface IHttpKernelConfig<TContext extends IContext = IContext> {
    decorateResponse: ResponseDecorator<TContext>;
    routeBuilderFactory: IRouteBuilderFactory;
    httpErrorHandlers: IHttpErrorHandlers<TContext>;
}
