// Informational responses
/** Indicates that the request was received and the client can continue. */
export const HTTP_100_CONTINUE = 100;
/** The server is switching protocols as requested by the client. */
export const HTTP_101_SWITCHING_PROTOCOLS = 101;
/** The server has received and is processing the request, but no response is available yet. */
export const HTTP_102_PROCESSING = 102;

// Successful responses
/** The request has succeeded. */
export const HTTP_200_OK = 200;
/** The request has succeeded and a new resource has been created as a result. */
export const HTTP_201_CREATED = 201;
/** The request has been accepted for processing, but the processing is not complete. */
export const HTTP_202_ACCEPTED = 202;
/** The server has successfully fulfilled the request and there is no content to send. */
export const HTTP_204_NO_CONTENT = 204;

// Redirection messages
/** The resource has been moved permanently to a new URI. */
export const HTTP_301_MOVED_PERMANENTLY = 301;
/** The resource resides temporarily under a different URI. */
export const HTTP_302_FOUND = 302;
/** Indicates that the resource has not been modified since the last request. */
export const HTTP_304_NOT_MODIFIED = 304;

// Client error responses
/** The server could not understand the request due to invalid syntax. */
export const HTTP_400_BAD_REQUEST = 400;
/** The request requires user authentication. */
export const HTTP_401_UNAUTHORIZED = 401;
/** The server understood the request but refuses to authorize it. */
export const HTTP_403_FORBIDDEN = 403;
/** The server cannot find the requested resource. */
export const HTTP_404_NOT_FOUND = 404;
/** The request method is known by the server but is not supported by the target resource. */
export const HTTP_405_METHOD_NOT_ALLOWED = 405;
/** The request could not be completed due to a conflict with the current state of the resource. */
export const HTTP_409_CONFLICT = 409;
/** The server understands the content type but was unable to process the contained instructions. */
export const HTTP_422_UNPROCESSABLE_ENTITY = 422;
/** The user has sent too many requests in a given amount of time. */
export const HTTP_429_TOO_MANY_REQUESTS = 429;

// Server error responses
/** The server encountered an unexpected condition that prevented it from fulfilling the request. */
export const HTTP_500_INTERNAL_SERVER_ERROR = 500;
/** The server does not support the functionality required to fulfill the request. */
export const HTTP_501_NOT_IMPLEMENTED = 501;
/** The server, while acting as a gateway or proxy, received an invalid response from the upstream server. */
export const HTTP_502_BAD_GATEWAY = 502;
/** The server is not ready to handle the request, often due to maintenance or overload. */
export const HTTP_503_SERVICE_UNAVAILABLE = 503;
/** The server is acting as a gateway and cannot get a response in time. */
export const HTTP_504_GATEWAY_TIMEOUT = 504;

/**
 * A constant list of supported HTTP status codes used by this application.
 *
 * These constants are grouped by category and used to construct the union type `HttpStatusCode`.
 */
export const validHttpStatusCodes = [
    // Informational
    HTTP_100_CONTINUE,
    HTTP_101_SWITCHING_PROTOCOLS,
    HTTP_102_PROCESSING,

    // Successful
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_202_ACCEPTED,
    HTTP_204_NO_CONTENT,

    // Redirection
    HTTP_301_MOVED_PERMANENTLY,
    HTTP_302_FOUND,
    HTTP_304_NOT_MODIFIED,

    // Client Errors
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_405_METHOD_NOT_ALLOWED,
    HTTP_409_CONFLICT,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_429_TOO_MANY_REQUESTS,

    // Server Errors
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_501_NOT_IMPLEMENTED,
    HTTP_502_BAD_GATEWAY,
    HTTP_503_SERVICE_UNAVAILABLE,
    HTTP_504_GATEWAY_TIMEOUT,
] as const;

/**
 * A constant list of HTTP error codes that are commonly used in the application.
 */
export const validHttpErrorCodes = [
    // Client Errors
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_405_METHOD_NOT_ALLOWED,
    HTTP_409_CONFLICT,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_429_TOO_MANY_REQUESTS,

    // Server Errors
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_501_NOT_IMPLEMENTED,
    HTTP_502_BAD_GATEWAY,
    HTTP_503_SERVICE_UNAVAILABLE,
    HTTP_504_GATEWAY_TIMEOUT,
] as const;

/**
 * Maps each supported HTTP status code to its standard status message.
 *
 * Useful for logging, diagnostics, or building custom error responses.
 */
export const HttpStatusTextMap: Record<
    typeof validHttpStatusCodes[number],
    string
> = {
    [HTTP_100_CONTINUE]: 'Continue',
    [HTTP_101_SWITCHING_PROTOCOLS]: 'Switching Protocols',
    [HTTP_102_PROCESSING]: 'Processing',

    [HTTP_200_OK]: 'OK',
    [HTTP_201_CREATED]: 'Created',
    [HTTP_202_ACCEPTED]: 'Accepted',
    [HTTP_204_NO_CONTENT]: 'No Content',

    [HTTP_301_MOVED_PERMANENTLY]: 'Moved Permanently',
    [HTTP_302_FOUND]: 'Found',
    [HTTP_304_NOT_MODIFIED]: 'Not Modified',

    [HTTP_400_BAD_REQUEST]: 'Bad Request',
    [HTTP_401_UNAUTHORIZED]: 'Unauthorized',
    [HTTP_403_FORBIDDEN]: 'Forbidden',
    [HTTP_404_NOT_FOUND]: 'Not Found',
    [HTTP_405_METHOD_NOT_ALLOWED]: 'Method Not Allowed',
    [HTTP_409_CONFLICT]: 'Conflict',
    [HTTP_422_UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
    [HTTP_429_TOO_MANY_REQUESTS]: 'Too Many Requests',

    [HTTP_500_INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    [HTTP_501_NOT_IMPLEMENTED]: 'Not Implemented',
    [HTTP_502_BAD_GATEWAY]: 'Bad Gateway',
    [HTTP_503_SERVICE_UNAVAILABLE]: 'Service Unavailable',
    [HTTP_504_GATEWAY_TIMEOUT]: 'Gateway Timeout',
};

/**
 * A union type representing commonly used HTTP status codes.
 *
 * This type ensures consistency between runtime and type-level status code handling.
 *
 * Example:
 * ```ts
 * const status: HttpStatusCode = 404; // ✅ valid
 * const status: HttpStatusCode = 418; // ❌ Type error (unless added to list)
 * ```
 */
export type HttpStatusCode = typeof validHttpStatusCodes[number];

/**
 * Type guard to check whether a given value is a valid HTTP status code.
 *
 * This is useful for validating numeric values received from external input,
 * ensuring they conform to known HTTP semantics.
 *
 * Example:
 * ```ts
 * if (isHttpStatusCode(value)) {
 *   // value is now typed as HttpStatusCode
 * }
 * ```
 *
 * @param value - The numeric value to check.
 * @returns `true` if the value is a recognized HTTP status code, otherwise `false`.
 */
export function isHttpStatusCode(value: unknown): value is HttpStatusCode {
    return typeof value === 'number' &&
        validHttpStatusCodes.includes(value as HttpStatusCode);
}
