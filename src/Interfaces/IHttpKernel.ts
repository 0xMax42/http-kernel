import { IRouteBuilder } from './IRouteBuilder.ts';
import { IRouteDefinition } from './IRouteDefinition.ts';

/**
 * Defines the core interface for the HTTP kernel, responsible for route registration,
 * middleware orchestration, and request dispatching.
 */
export interface IHttpKernel {
    /**
     * Registers a new route with a static path pattern or a dynamic matcher.
     *
     * This method accepts both conventional route definitions (with path templates)
     * and advanced matcher-based routes for flexible URL structures.
     *
     * Returns a route builder that allows chaining middleware and assigning a handler.
     *
     * @param definition - A static or dynamic route definition, including the HTTP method
     *                     and either a path pattern or custom matcher function.
     * @returns A builder interface to attach middleware and define the handler.
     */
    route(definition: IRouteDefinition): IRouteBuilder;

    /**
     * Handles an incoming HTTP request by matching it against registered routes,
     * executing any associated middleware in order, and invoking the final route handler.
     *
     * This method serves as the main entry point to integrate with `Deno.serve`.
     *
     * @param request - The incoming HTTP request object.
     * @returns A promise resolving to the final HTTP response.
     */
    handle(request: Request): Promise<Response>;
}
