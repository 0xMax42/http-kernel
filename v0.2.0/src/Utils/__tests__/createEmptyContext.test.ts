import { assertEquals } from 'https://deno.land/std/assert/mod.ts';
import { createEmptyContext } from '../createEmptyContext.ts';
import type { IContext } from '../../Interfaces/mod.ts';

Deno.test('createEmptyContext: returns default-initialized context', () => {
    const request = new Request('http://localhost');
    const ctx = createEmptyContext(request);

    assertEquals(ctx.req, request);
    assertEquals(ctx.params, {});
    assertEquals(ctx.query, {});
    assertEquals(ctx.state, {});
});

Deno.test('createEmptyContext: preserves generic type compatibility', () => {
    interface MyContext
        extends
            IContext<{ userId: string }, { id: string }, { verbose: string }> {}

    const req = new Request('http://localhost');
    const ctx = createEmptyContext<MyContext>(req);

    // All properties exist and are empty
    assertEquals(ctx.params, {} as MyContext['params']);
    assertEquals(ctx.query, {} as MyContext['query']);
    assertEquals(ctx.state, {} as MyContext['state']);
    assertEquals(ctx.req, req);
});
