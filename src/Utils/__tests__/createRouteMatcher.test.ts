import {
    assert,
    assertEquals,
    assertStrictEquals,
} from 'https://deno.land/std/assert/mod.ts';
import { IRouteDefinition } from '../../Interfaces/mod.ts';
import { createRouteMatcher } from '../../mod.ts';

// Dummy request
const dummyRequest = new Request('http://localhost');

Deno.test('createRouteMatcher: static route matches and extracts params', () => {
    const def: IRouteDefinition = { method: 'GET', path: '/users/:id' };
    const matcher = createRouteMatcher(def);

    const result = matcher(new URL('http://localhost/users/42'), dummyRequest);

    assert(result);
    assertEquals(result.params, { id: '42' });
});

Deno.test('createRouteMatcher: static route with multiple params', () => {
    const def: IRouteDefinition = { method: 'GET', path: '/repo/:owner/:name' };
    const matcher = createRouteMatcher(def);

    const result = matcher(
        new URL('http://localhost/repo/max/wiki'),
        dummyRequest,
    );

    assert(result);
    assertEquals(result.params, { owner: 'max', name: 'wiki' });
});

Deno.test('createRouteMatcher: static route does not match wrong path', () => {
    const def: IRouteDefinition = { method: 'GET', path: '/users/:id' };
    const matcher = createRouteMatcher(def);

    const result = matcher(new URL('http://localhost/posts/42'), dummyRequest);

    assertStrictEquals(result, null);
});

Deno.test('createRouteMatcher: uses custom matcher if provided', () => {
    const def: IRouteDefinition = {
        method: 'GET',
        matcher: (url) => url.pathname === '/ping' ? { params: {} } : null,
    };
    const matcher = createRouteMatcher(def);

    const result = matcher(new URL('http://localhost/ping'), dummyRequest);
    assert(result);
    assertEquals(result.params, {});
});
