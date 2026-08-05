import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('key', 42));
    expect(result.current[0]).toBe(42);
  });

  it('persists a value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 0));
    act(() => {
      result.current[1](99);
    });
    expect(result.current[0]).toBe(99);
    expect(JSON.parse(localStorage.getItem('key')!)).toBe(99);
  });

  it('reads an existing value from localStorage on mount', () => {
    localStorage.setItem('key', JSON.stringify('hello'));
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('hello');
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage<number[]>('nums', [1, 2]));
    act(() => {
      result.current[1]((prev) => [...prev, 3]);
    });
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it('returns the initial value when localStorage contains invalid JSON', () => {
    localStorage.setItem('bad', 'not-json{');
    const { result } = renderHook(() => useLocalStorage('bad', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });
});
