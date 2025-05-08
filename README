# HttpKernel – A Type-Safe Router & Middleware Kernel for Deno

> Fluent routing • Zero-dependency core • 100 % TypeScript

HttpKernel is a small but powerful dispatching engine that turns an ordinary
`Deno.serve()` loop into a structured, middleware-driven HTTP server.  
It focuses on **type safety**, **immutability**, and an **expressive builder API**
while staying framework-agnostic and dependency‑free.

---

## ✨ Key Features

* **Fluent Route Builder** – chain middleware and handlers without side effects  
* **Static *and* Dynamic Matching** – use URL patterns *or* custom matcher functions  
* **First-Class Generics** – strongly‑typed `ctx.params`, `ctx.query`, and `ctx.state`  
* **Pluggable Error Handling** – override 404/500 (and any other status) per kernel  
* **Response Decorators** – inject CORS headers, security headers, logging, … in one place  
* **100 % Test Coverage** – built‑in unit tests ensure every edge case is covered

---

## 🚀 Quick Start

```ts
// Import directly from your repo or deno.land/x
import { HttpKernel } from "https://deno.land/x/httpkernel/mod.ts";

// 1) Create a kernel (optionally pass overrides)
const kernel = new HttpKernel();

// 2) Register a route with fluent chaining
kernel
  .route({ method: "GET", path: "/hello/:name" })
  .middleware(async (ctx, next) => {
    console.log("Incoming request for", ctx.params.name);
    return await next(); // continue pipeline
  })
  .handle(async (ctx) =>
    new Response(`Hello ${ctx.params.name}!`, { status: 200 })
  );

// 3) Let Deno serve the kernel
Deno.serve(kernel.handle);
```

Run it:

```bash
deno run --allow-net main.ts
# → GET http://localhost:8000/hello/Isaac
```

---

## 🧩 API Overview

| Method / Type         | Purpose                                        | Hints                                                         |
| --------------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `kernel.route(def)`   | Begin defining a new route. Returns `RouteBuilder`. | `def` can be `{ method, path }` **or** `{ method, matcher }`. |
| `.middleware(fn)`     | Add a middleware to the current builder.       | Each call returns a *new* builder (immutability).             |
| `.handle(fn)`         | Finalise the route and register the handler.   | Must be called exactly once per route.                        |
| `kernel.handle(req)`  | Kernel entry point you pass to `Deno.serve()`. | Resolves to a `Response`.                                     |

### Context Shape

```ts
interface Context<S = Record<string, unknown>> {
  req: Request;                   // original request
  params: Record<string>;         // route params e.g. { id: "42" }
  query: Record<string | string[]>; // parsed query string
  state: S;                       // per‑request mutable storage
}
```

Generics let you supply your own param / query / state types for full IntelliSense.

---

## 🛠️ Configuration

```ts
new HttpKernel({
  decorateResponse: (res, ctx) => {
    // add CORS header globally
    const headers = new Headers(res.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    return new Response(res.body, { ...res, headers });
  },
  httpErrorHandlers: {
    404: () => new Response("Nothing here ☹️", { status: 404 }),
    500: (_ctx, err) => {
      console.error(err);
      return new Response("Custom 500", { status: 500 });
    },
  },
});
```

Everything is optional – omit what you do not override.

---

## 🧪 Testing

All logic is covered by unit tests using `std@0.204.0/testing`.  
Run them with:

```bash
deno test -A
```

The CI suite checks:

* Route guards (`isStaticRouteDefinition`, `isDynamicRouteDefinition`)
* Builder immutability & middleware order
* 404 / 500 fall-backs and error propagation
* Middleware mis-use (double `next()`, wrong signatures, …)

---

## 📦 Roadmap

* 🔌 Adapter helpers for Oak / Fresh / any framework that can delegate to `kernel.handle`
* 🔍 Built‑in logger & timing middleware
* 🔒 CSRF & auth middleware presets
* 📝 OpenAPI route generator

Contributions & ideas are welcome – feel free to open an issue or PR.

---

## 📄 License

[MIT](LICENSE)
