/**
 * Represents an error thrown when an incoming HTTP method
 * is not among the recognized set of valid HTTP methods.
 *
 * This is typically used in routers or request dispatchers
 * to enforce allowed methods and produce 405-like behavior.
 */
export class InvalidHttpMethodError extends Error {
    /**
     * The invalid method that triggered this error.
     */
    public readonly method: unknown;

    /**
     * A fixed HTTP status code representing "Method Not Allowed".
     */
    public readonly status: number = 405;

    constructor(method: unknown) {
        const label = typeof method === 'string' ? method : '[non-string]';
        super(`Unsupported HTTP method: ${label}`);
        this.name = 'InvalidHttpMethodError';
        this.method = method;
    }
}
