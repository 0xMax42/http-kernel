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

Deno.test('createRouteMatcher: extracts single query param', () => {
    const def: IRouteDefinition = { method: 'GET', path: '/search' };
    const matcher = createRouteMatcher(def);

    const url = new URL('http://localhost/search?q=deno');
    const result = matcher(url, dummyRequest);

    assert(result);
    assertEquals(result.params, {}); // no path params
    assertEquals(result.query, { q: 'deno' }); // single key → string
});

Deno.test('createRouteMatcher: duplicate query keys become array', () => {
    const def: IRouteDefinition = { method: 'GET', path: '/tags' };
    const matcher = createRouteMatcher(def);

    const url = new URL('http://localhost/tags?tag=js&tag=ts&tag=deno');
    const result = matcher(url, dummyRequest);

    assert(result);
    assertEquals(result.params, {});
    assertEquals(result.query, { tag: ['js', 'ts', 'deno'] }); // multi → string[]
});

Deno.test('createRouteMatcher: mix of single and duplicate keys', () => {
    const def: IRouteDefinition = { method: 'GET', path: '/filter/:type' };
    const matcher = createRouteMatcher(def);

    const url = new URL('http://localhost/filter/repo?lang=ts&lang=js&page=2');
    const result = matcher(url, dummyRequest);

    assert(result);
    assertEquals(result.params, { type: 'repo' });
    assertEquals(result.query, {
        lang: ['ts', 'js'], // duplicated
        page: '2', // single
    });
});

Deno.test('createRouteMatcher: no query parameters returns empty object', () => {
    const def: IRouteDefinition = { method: 'GET', path: '/info' };
    const matcher = createRouteMatcher(def);

    const url = new URL('http://localhost/info');
    const result = matcher(url, dummyRequest);

    assert(result);
    assertEquals(result.params, {});
    assertEquals(result.query, {}); // empty
});

Deno.test('createRouteMatcher: retains array order of duplicate keys', () => {
    const def: IRouteDefinition = { method: 'GET', path: '/order' };
    const matcher = createRouteMatcher(def);

    const url = new URL(
        'http://localhost/order?item=first&item=second&item=third',
    );
    const result = matcher(url, dummyRequest);

    assert(result);
    assertEquals(result.query?.item, ['first', 'second', 'third']);
});
