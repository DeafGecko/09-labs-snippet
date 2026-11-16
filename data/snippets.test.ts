import { describe, it, expect } from 'vitest';
import { allSnippets } from './snippets';

describe('seed snippets', () => {
  it('gives every snippet a unique id', () => {
    const ids = allSnippets.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every snippet a non-empty title, description, code, and at least one tag', () => {
    for (const snippet of allSnippets) {
      expect(snippet.title.trim(), `${snippet.id} title`).not.toBe('');
      expect(snippet.description.trim(), `${snippet.id} description`).not.toBe('');
      expect(snippet.code.trim(), `${snippet.id} code`).not.toBe('');
      expect(snippet.tags.length, `${snippet.id} tags`).toBeGreaterThan(0);
    }
  });
});
