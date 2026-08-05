import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useLocalStorage } from '../useLocalStorage';

const TEST_KEY = 'test-key';

afterEach(() => {
  localStorage.clear();
});

describe('useLocalStorage', () => {
  it('returns the initialValue when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'hello'));
    expect(result.current[0]).toBe('hello');
  });

  it('reads an existing value from localStorage on mount', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify('persisted'));
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
    expect(result.current[0]).toBe('persisted');
  });

  it('persists a new value to localStorage after update', async () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 0));
    act(() => {
      result.current[1](42);
    });
    expect(result.current[0]).toBe(42);
    // useEffect runs after render; value should be written to localStorage
    expect(JSON.parse(localStorage.getItem(TEST_KEY)!)).toBe(42);
  });

  it('supports functional updater form', () => {
    const { result } = renderHook(() => useLocalStorage<number>(TEST_KEY, 10));
    act(() => {
      result.current[1]((prev) => prev + 5);
    });
    expect(result.current[0]).toBe(15);
    expect(JSON.parse(localStorage.getItem(TEST_KEY)!)).toBe(15);
  });

  it('falls back to initialValue when localStorage contains invalid JSON', () => {
    localStorage.setItem(TEST_KEY, '{bad json}');
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, [1, 2, 3]));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it('works with object values', () => {
    const initial = { a: 1, b: 'two' };
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, initial));
    act(() => {
      result.current[1]({ a: 99, b: 'updated' });
    });
    expect(result.current[0]).toEqual({ a: 99, b: 'updated' });
    expect(JSON.parse(localStorage.getItem(TEST_KEY)!)).toEqual({ a: 99, b: 'updated' });
  });

  it('works with array values', () => {
    const { result } = renderHook(() => useLocalStorage<string[]>(TEST_KEY, []));
    act(() => {
      result.current[1](['x', 'y']);
    });
    expect(result.current[0]).toEqual(['x', 'y']);
  });
});
