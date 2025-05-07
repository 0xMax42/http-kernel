// src/Types/__tests__/HttpStatusCode.test.ts
import { assertEquals } from 'https://deno.land/std@0.204.0/assert/mod.ts';
import { isHttpStatusCode, validHttpStatusCodes } from '../HttpStatusCode.ts';

Deno.test('isHttpStatusCode: returns true for all valid status codes', () => {
    for (const code of validHttpStatusCodes) {
        assertEquals(
            isHttpStatusCode(code),
            true,
            `Expected ${code} to be valid`,
        );
    }
});

Deno.test('isHttpStatusCode: returns false for invalid status codes', () => {
    const invalidInputs = [99, 600, 1234, -1, 0, 999];
    for (const val of invalidInputs) {
        assertEquals(
            isHttpStatusCode(val),
            false,
            `Expected ${val} to be invalid`,
        );
    }
});

Deno.test('isHttpStatusCode: returns false for non-numeric values', () => {
    const invalid = ['200', null, undefined, {}, [], true];
    for (const val of invalid) {
        assertEquals(
            isHttpStatusCode(val),
            false,
            `Expected ${val} to be invalid`,
        );
    }
});
