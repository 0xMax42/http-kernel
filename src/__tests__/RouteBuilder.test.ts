import {
    assert,
    assertEquals,
    assertNotEquals,
    assertThrows,
} from 'https://deno.land/std@0.204.0/assert/mod.ts';
import {
    IHandler,
    IInternalRoute,
    IMiddleware,
    IRouteDefinition,
} from '../Interfaces/mod.ts';
import { RouteBuilder } from '../mod.ts';

// Dummy objects
const dummyHandler: IHandler = async () => new Response('ok');
const dummyMiddleware: IMiddleware = async (_, next) => await next();
const dummyDef: IRouteDefinition = { method: 'get', path: '/hello' };
const dummyMatcher = () => ({ params: {} });

Deno.test('middleware: single middleware is registered correctly', () => {
    let registered: IInternalRoute | null = null as IInternalRoute | null;

    const builder = new RouteBuilder((r) => registered = r, dummyDef)
        .middleware(dummyMiddleware);

    builder.handle(dummyHandler);

    assert(registered);
    assertEquals(registered?.middlewares.length, 1);
    assertEquals(registered?.middlewares[0], dummyMiddleware);
});

Deno.test('middleware: middleware is chained immutably', () => {
    const builder1 = new RouteBuilder(() => {}, dummyDef);
    const builder2 = builder1.middleware(dummyMiddleware);

    assertNotEquals(builder1, builder2);
});

Deno.test('middleware: preserves order of middleware', () => {
    const mw1: IMiddleware = async (_, next) => await next();
    const mw2: IMiddleware = async (_, next) => await next();

    let result: IInternalRoute | null = null as IInternalRoute | null;

    const builder = new RouteBuilder((r) => result = r, dummyDef)
        .middleware(mw1)
        .middleware(mw2);

    builder.handle(dummyHandler);

    assert(result);
    assertEquals(result!.middlewares, [mw1, mw2]);
});

Deno.test('handle: uppercases method', () => {
    let result: IInternalRoute | null = null as IInternalRoute | null;

    new RouteBuilder((r) => result = r, { method: 'post', path: '/x' })
        .handle(dummyHandler);

    assertEquals(result?.method, 'POST');
});

Deno.test('handle: works with no middleware', async () => {
    let route: IInternalRoute | null = null as IInternalRoute | null;

    const builder = new RouteBuilder((r) => route = r, dummyDef);
    builder.handle(dummyHandler);

    assert(route);
    assertEquals(route?.middlewares.length, 0);

    const request = new Request('http://localhost');

    const res1 = await route?.handler({ req: request, params: {}, state: {} });
    const res2 = await dummyHandler({ req: request, params: {}, state: {} });

    assertEquals(res1?.status, res2?.status);
    assertEquals(await res1?.text(), await res2?.text());
});

Deno.test('handle: uses custom matcher factory', () => {
    let called = false;

    const factory = (def: IRouteDefinition) => {
        called = true;
        return dummyMatcher;
    };

    let route: IInternalRoute | null = null as IInternalRoute | null;

    new RouteBuilder((r) => route = r, dummyDef, [], factory).handle(
        dummyHandler,
    );

    assert(called);
    assert(route);
    assertEquals(route!.matcher, dummyMatcher);
});

Deno.test('handle: throws if matcher factory throws', () => {
    const faultyFactory = () => {
        throw new Error('matcher fail');
    };

    const builder = new RouteBuilder(() => {}, dummyDef, [], faultyFactory);

    assertThrows(() => builder.handle(dummyHandler), Error, 'matcher fail');
});
