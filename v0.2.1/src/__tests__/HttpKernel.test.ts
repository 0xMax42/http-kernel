import {
    assertEquals,
    assertThrows,
} from 'https://deno.land/std@0.204.0/assert/mod.ts';
import { HttpKernel } from '../HttpKernel.ts';
import type { IRouteDefinition } from '../Interfaces/mod.ts';

Deno.test('HttpKernel: matches static route and executes handler', async () => {
    const kernel = new HttpKernel();

    const def: IRouteDefinition = { method: 'GET', path: '/hello' };
    let called = false;

    kernel.route(def).handle((_ctx) => {
        called = true;
        return Promise.resolve(new Response('OK', { status: 200 }));
    });

    const res = await kernel.handle(
        new Request('http://localhost/hello', { method: 'GET' }),
    );
    assertEquals(res.status, 200);
    assertEquals(await res.text(), 'OK');
    assertEquals(called, true);
});

Deno.test('HttpKernel: supports dynamic matcher', async () => {
    const kernel = new HttpKernel();
    const def: IRouteDefinition = {
        method: 'GET',
        matcher: (url) => url.pathname === '/dyn' ? { params: {} } : null,
    };

    kernel.route(def).handle((_ctx) =>
        Promise.resolve(new Response('Dyn', { status: 200 }))
    );

    const res = await kernel.handle(new Request('http://localhost/dyn'));
    assertEquals(res.status, 200);
    assertEquals(await res.text(), 'Dyn');
});

Deno.test('HttpKernel: calls middleware in order and passes to handler', async () => {
    const kernel = new HttpKernel();
    const calls: string[] = [];

    kernel.route({ method: 'GET', path: '/test' })
        .middleware(async (_ctx, next) => {
            calls.push('mw1');
            return await next();
        })
        .middleware(async (_ctx, next) => {
            calls.push('mw2');
            return await next();
        })
        .handle((_ctx) => {
            calls.push('handler');
            return Promise.resolve(new Response('done'));
        });

    const res = await kernel.handle(
        new Request('http://localhost/test', { method: 'GET' }),
    );
    assertEquals(await res.text(), 'done');
    assertEquals(calls, ['mw1', 'mw2', 'handler']);
});

Deno.test('HttpKernel: middleware short-circuits pipeline', async () => {
    const kernel = new HttpKernel();
    const calls: string[] = [];

    kernel.route({ method: 'GET', path: '/stop' })
        .middleware((_ctx, _next) => {
            calls.push('mw1');
            return Promise.resolve(new Response('blocked', { status: 403 }));
        })
        .middleware((_ctx, _next) => {
            calls.push('mw2');
            return Promise.resolve(new Response('should-not-call'));
        })
        .handle((_ctx) => {
            calls.push('handler');
            return Promise.resolve(new Response('ok'));
        });

    const res = await kernel.handle(
        new Request('http://localhost/stop', { method: 'GET' }),
    );
    assertEquals(res.status, 403);
    assertEquals(await res.text(), 'blocked');
    assertEquals(calls, ['mw1']);
});

Deno.test('HttpKernel: invalid middleware or handler signature throws at compile time', () => {
    const kernel = new HttpKernel();

    // Middleware with wrong signature (missing ctx, next)
    assertThrows(
        () => {
            kernel.route({ method: 'GET', path: '/bad-mw' })
                // @ts-expect-error invalid middleware
                .middleware(() => new Response('invalid'))
                .handle((_ctx) => Promise.resolve(new Response('ok')));
        },
        TypeError,
        'Middleware at index 0 is not a valid function.',
    );

    // Handler with wrong signature (no ctx)
    assertThrows(
        () => {
            kernel.route({ method: 'GET', path: '/bad-handler' })
                .middleware(async (_ctx, next) => await next())
                // @ts-expect-error invalid handler
                .handle(() => new Response('invalid'));
        },
        TypeError,
        'Route handler must be a function returning a Promise<Response>.',
    );
});

Deno.test('HttpKernel: 404 for unmatched route', async () => {
    const kernel = new HttpKernel();
    const res = await kernel.handle(new Request('http://localhost/nothing'));
    assertEquals(res.status, 404);
});

Deno.test('HttpKernel: skips route with wrong method', async () => {
    const kernel = new HttpKernel();

    kernel.route({ method: 'POST', path: '/only-post' })
        .handle((_ctx) => Promise.resolve(new Response('nope')));

    const res = await kernel.handle(
        new Request('http://localhost/only-post', { method: 'GET' }),
    );
    assertEquals(res.status, 404);
});

Deno.test('HttpKernel: throws on next() called twice', async () => {
    const kernel = new HttpKernel();

    kernel.route({ method: 'GET', path: '/bad' })
        .middleware(async (_ctx, next) => {
            await next();
            await next(); // ❌
            return new Response('should never reach');
        })
        .handle((_ctx) => Promise.resolve(new Response('OK')));

    const res = await kernel.handle(new Request('http://localhost/bad'));
    assertEquals(res.status, 500);
    assertEquals(await res.text(), 'Internal Server Error');
});

Deno.test('HttpKernel: handler throws → error propagates', async () => {
    const kernel = new HttpKernel();

    kernel.route({ method: 'GET', path: '/throw' })
        .handle((_ctx) => {
            throw new Error('fail!');
        });

    const res = await kernel.handle(new Request('http://localhost/throw'));
    assertEquals(res.status, 500);
    assertEquals(await res.text(), 'Internal Server Error');
});

Deno.test('HttpKernel: returns 500 if no handler or middleware defined', async () => {
    const kernel = new HttpKernel();

    // Force-manual Registrierung mit `handler: undefined`
    // Umgehen des Builders zur Simulation dieses Edge-Cases
    kernel['routes'].push({
        method: 'GET',
        matcher: (url) => url.pathname === '/fail' ? { params: {} } : null,
        middlewares: [],
        // @ts-expect-error absichtlich ungültiger Handler
        handler: undefined,
    });

    const res = await kernel.handle(new Request('http://localhost/fail'));
    assertEquals(res.status, 500);
    assertEquals(await res.text(), 'Internal Server Error');
});
