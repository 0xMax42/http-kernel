import {
    assertEquals,
    assertInstanceOf,
} from 'https://deno.land/std/assert/mod.ts';
import { normalizeError } from '../normalizeError.ts';

Deno.test('normalizeError: preserves Error instances', () => {
    const original = new Error('original');
    const result = normalizeError(original);

    assertInstanceOf(result, Error);
    assertEquals(result, original);
});

Deno.test('normalizeError: converts string to Error', () => {
    const result = normalizeError('something went wrong');

    assertInstanceOf(result, Error);
    assertEquals(result.message, 'something went wrong');
});

Deno.test('normalizeError: converts number to Error', () => {
    const result = normalizeError(404);

    assertInstanceOf(result, Error);
    assertEquals(result.message, '404');
});

Deno.test('normalizeError: converts plain object to Error', () => {
    const input = { error: true, msg: 'Invalid' };
    const result = normalizeError(input);

    assertInstanceOf(result, Error);
    assertEquals(result.message, JSON.stringify(input));
});
