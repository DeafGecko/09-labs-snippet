import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns the fallback when the key is missing', () => {
    expect(storage.get('missing-key', ['fallback'])).toEqual(['fallback']);
  });

  it('parses stored JSON back into its original value', () => {
    localStorage.setItem('09labs-theme', JSON.stringify('coffee'));
    expect(storage.get('09labs-theme', 'dark')).toBe('coffee');
  });

  it('returns the fallback and warns when stored JSON is malformed', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem('09labs-favorites', '{not json');

    expect(storage.get('09labs-favorites', [])).toEqual([]);
    expect(warn).toHaveBeenCalled();
  });

  it('round-trips a value through set and get', () => {
    const favorites = ['gen-1', 'gen-4'];
    storage.set('09labs-favorites', favorites);

    expect(storage.get('09labs-favorites', [])).toEqual(favorites);
  });

  it('swallows write errors such as a full quota and warns instead of throwing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });

    expect(() => storage.set('09labs-custom-snippets', [])).not.toThrow();
    expect(warn).toHaveBeenCalled();
  });
});

