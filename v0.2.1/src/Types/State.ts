/**
 * Represents the per-request state object shared across the middleware pipeline.
 *
 * This type defines the base structure for custom state definitions,
 * which can be extended with concrete fields like user data, request metadata, etc.
 *
 * Custom `TState` types must extend this base to ensure compatibility.
 */
export type State = Record<string, unknown>;
