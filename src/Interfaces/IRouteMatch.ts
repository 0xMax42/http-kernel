import { Params, Query } from '../Types/mod.ts';

export interface IRouteMatch {
    params?: Params;
    query?: Query;
}
