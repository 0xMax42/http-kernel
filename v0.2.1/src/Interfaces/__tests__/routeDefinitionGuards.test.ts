import { assertEquals } from 'https://deno.land/std@0.204.0/assert/mod.ts';
import {
    type IRouteDefinition,
    isDynamicRouteDefinition,
    isStaticRouteDefinition,
} from '../IRouteDefinition.ts';

Deno.test('isStaticRouteDefinition returns true for static route', () => {
    const staticDef: IRouteDefinition = {
        method: 'GET',
        path: '/users/:id',
    };

    assertEquals(isStaticRouteDefinition(staticDef), true);
    assertEquals(isDynamicRouteDefinition(staticDef), false);
});

Deno.test('isDynamicRouteDefinition returns true for dynamic route', () => {
    const dynamicDef: IRouteDefinition = {
        method: 'POST',
        matcher: (_url, _req) => ({ params: {} }),
    };

    assertEquals(isDynamicRouteDefinition(dynamicDef), true);
    assertEquals(isStaticRouteDefinition(dynamicDef), false);
});

Deno.test('isStaticRouteDefinition returns false for invalid object', () => {
    const invalidDef = {
        method: 'GET',
    } as unknown as IRouteDefinition;

    assertEquals(isStaticRouteDefinition(invalidDef), false);
});

Deno.test('isDynamicRouteDefinition returns false for object with no matcher', () => {
    const def = {
        method: 'DELETE',
        path: '/something',
    };

    assertEquals(isDynamicRouteDefinition(def as IRouteDefinition), false);
});
