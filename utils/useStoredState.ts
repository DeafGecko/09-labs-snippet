'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { storage } from './storage';

// Components that write to localStorage in this tab don't get a storage
// event, so they notify these listeners directly.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Server render and first client render both use `fallback`, so hydration
// matches. The saved value appears on the next render, with no effect.
export function useStoredState<T>(key: string, fallback: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null
  );

  const setValue = useCallback(
    (value: T) => {
      storage.set(key, value);
      listeners.forEach((listener) => listener());
    },
    [key]
  );

  return [parse(raw, fallback), setValue] as const;
}
