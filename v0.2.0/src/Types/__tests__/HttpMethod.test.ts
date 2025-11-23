import { assertEquals } from 'https://deno.land/std/assert/mod.ts';
import { isHttpMethod, validHttpMethods } from '../HttpMethod.ts';

Deno.test('isHttpMethod: returns true for all valid methods', () => {
    for (const method of validHttpMethods) {
        const result = isHttpMethod(method);
        assertEquals(result, true, `Expected "${method}" to be valid`);
    }
});

Deno.test('isHttpMethod: returns false for lowercase or unknown strings', () => {
    const invalid = [
        'get',
        'post',
        'FETCH',
        'TRACE',
        'CONNECT',
        'INVALID',
        '',
        ' ',
    ];

    for (const method of invalid) {
        const result = isHttpMethod(method);
        assertEquals(result, false, `Expected "${method}" to be invalid`);
    }
});

Deno.test('isHttpMethod: returns false for non-string inputs', () => {
    const invalidInputs = [null, undefined, 123, {}, [], true, Symbol('GET')];

    for (const input of invalidInputs) {
        const result = isHttpMethod(input);
        assertEquals(
            result,
            false,
            `Expected non-string input to be invalid: ${String(input)}`,
        );
    }
});
