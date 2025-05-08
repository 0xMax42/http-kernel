# 🧩 Plan: `PipelineExecutor<TContext>`

## 🎯 Ziel
Eine eigenständige, testbare Klasse zur Ausführung einer Middleware- und Handler-Pipeline, die:
- Linear und sauber das `next()`-Verhalten abbildet
- Typvalidierung durchführt (`isMiddleware`, `isHandler`)
- Fehler behandelt und an konfigurierbare Handler weiterleitet
- Optionale Hooks zur Tracing-Integration bietet (z. B. für Zeitmessung, Logging)
- Am Ende eine dekorierte `Response` zurückliefert

---

## 🧩 Schnittstelle (API)

```ts
class PipelineExecutor<TContext extends IContext> {
    constructor(cfg: IHttpKernelConfig<TContext>);

    run(
        ctx: TContext,
        middleware: Middleware<TContext>[],
        handler: Handler<TContext>,
        hooks?: IPipelineHooks<TContext>, // optional
    ): Promise<Response>;
}
```

---

## 🪝 Hook-Schnittstelle (`IPipelineHooks`)

```ts
interface IPipelineHooks<TContext> {
    onPipelineStart?(ctx: TContext): void;
    onStepStart?(name: string | undefined, ctx: TContext): void;
    onStepEnd?(name: string | undefined, ctx: TContext, duration: number): void;
    onPipelineEnd?(ctx: TContext, totalDuration: number): void;
}
```

- `name` ist `undefined`, wenn keine `.name` am Handler/Middleware gesetzt ist
- Diese Hooks ermöglichen später Logging, Zeitmessung, Statistiken etc.
- Der `TraceManager` wird dieses Interface implementieren

---

## 🛠️ Interne Aufgaben / Ablauf

1. `run(...)` beginnt mit Aufruf `onPipelineStart(ctx)`
2. Zeitmessung (`performance.now()`)
3. Dispatcher-Funktion führt jede Middleware mit `next()`-Kette aus
4. Vor jedem Aufruf: `onStepStart(name, ctx)`
5. Nach jedem Aufruf: `onStepEnd(name, ctx, duration)`
6. Nach letztem Handler: `onPipelineEnd(ctx, totalDuration)`
7. Ergebnis wird durch `cfg.decorateResponse(res, ctx)` geschickt
8. Im Fehlerfall: `cfg.httpErrorHandlers[500](ctx, error)`

---

## ✅ Vorteile

- `HttpKernel` ist von Ausführungsdetails entkoppelt
- Tracing-/Logging-System kann ohne Invasivität angeschlossen werden
- Sehr gut testbar (z. B. Middleware-Mock + Hook-Aufrufe prüfen)
- Erweiterbar für Timeout, Async-Context, Abbruchlogik etc.

---

## 📦 Dateiname-Vorschlag

- `src/Core/PipelineExecutor.ts` oder
- `src/HttpKernel/PipelineExecutor.ts`
