import type { IRouteDefinition } from '../Interfaces/mod.ts';
import { HttpKernel } from '../mod.ts';

const CONCURRENT_REQUESTS = 10000;

// Deno.bench('Simple request', async (b) => {
//     const kernel = new HttpKernel();

//     const def: IRouteDefinition = { method: 'GET', path: '/hello' };
//     kernel.route(def).handle((_ctx) => {
//         return Promise.resolve(new Response('OK', { status: 200 }));
//     });
//     b.start();
//     await kernel.handle(
//         new Request('http://localhost/hello', { method: 'GET' }),
//     );
//     b.end();
// });

Deno.bench('Simple request (parallel)', async (b) => {
    const kernel = new HttpKernel();

    const def: IRouteDefinition = { method: 'GET', path: '/hello' };
    kernel.route(def).handle((_ctx) => {
        return Promise.resolve(new Response('OK', { status: 200 }));
    });

    const requests = Array.from(
        { length: CONCURRENT_REQUESTS },
        () =>
            kernel.handle(
                new Request('http://localhost/hello', { method: 'GET' }),
            ),
    );

    b.start();
    await Promise.all(requests);
    b.end();
});

// Deno.bench('Complex request', async (b) => {
//     const kernel = new HttpKernel();

//     kernel.route({ method: 'GET', path: '/test' })
//         .middleware(async (_ctx, next) => {
//             return await next();
//         })
//         .middleware(async (_ctx, next) => {
//             return await next();
//         })
//         .handle((_ctx) => {
//             return Promise.resolve(new Response('done'));
//         });

//     b.start();
//     await kernel.handle(
//         new Request('http://localhost/test', { method: 'GET' }),
//     );
//     b.end();
// });

Deno.bench('Complex request (parallel)', async (b) => {
    const kernel = new HttpKernel();

    kernel.route({ method: 'GET', path: '/test' })
        .middleware(async (_ctx, next) => {
            return await next();
        })
        .middleware(async (_ctx, next) => {
            return await next();
        })
        .handle((_ctx) => {
            return Promise.resolve(new Response('done'));
        });

    const requests = Array.from(
        { length: CONCURRENT_REQUESTS },
        () =>
            kernel.handle(
                new Request('http://localhost/test', { method: 'GET' }),
            ),
    );

    b.start();
    await Promise.all(requests);
    b.end();
});
