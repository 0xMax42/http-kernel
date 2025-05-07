import { assertEquals } from 'https://deno.land/std/assert/mod.ts';
import { parseQuery } from '../parseQuery.ts';

Deno.test('parseQuery: single-value parameters are parsed as strings', () => {
    const url = new URL('http://localhost?foo=bar&limit=10');
    const result = parseQuery(url.searchParams);

    assertEquals(result, {
        foo: 'bar',
        limit: '10',
    });
});

Deno.test('parseQuery: multi-value parameters are parsed as string arrays', () => {
    const url = new URL('http://localhost?tag=ts&tag=deno&tag=web');
    const result = parseQuery(url.searchParams);

    assertEquals(result, {
        tag: ['ts', 'deno', 'web'],
    });
});

Deno.test('parseQuery: mixed single and multi-value parameters', () => {
    const url = new URL(
        'http://localhost?sort=asc&filter=active&filter=pending',
    );
    const result = parseQuery(url.searchParams);

    assertEquals(result, {
        sort: 'asc',
        filter: ['active', 'pending'],
    });
});

Deno.test('parseQuery: empty query string returns empty object', () => {
    const url = new URL('http://localhost');
    const result = parseQuery(url.searchParams);

    assertEquals(result, {});
});

Deno.test('parseQuery: repeated single-value keys are grouped', () => {
    const url = new URL('http://localhost?a=1&a=2&a=3');
    const result = parseQuery(url.searchParams);

    assertEquals(result, {
        a: ['1', '2', '3'],
    });
});
