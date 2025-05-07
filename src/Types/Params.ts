/**
 * Represents route parameters parsed from dynamic segments in the URL path.
 *
 * This type is typically derived from route definitions with placeholders,
 * such as `/users/:id`, which would yield `{ id: "123" }`.
 *
 * All values are strings and should be considered read-only, as they are
 * extracted by the router and should not be modified by application code.
 */
export type Params = Record<string, string | undefined>;
