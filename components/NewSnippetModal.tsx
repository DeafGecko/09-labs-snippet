'use client';

import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Snippet } from '@/data/snippets';

interface NewSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSnippet: (snippet: Snippet) => void;
  initialSnippet?: Snippet | null;
}

export default function NewSnippetModal({
  isOpen,
  onClose,
  onAddSnippet,
  initialSnippet,
}: NewSnippetModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [details, setDetails] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (initialSnippet) {
      setTitle(initialSnippet.title);
      setCategory(initialSnippet.category);
      setDescription(initialSnippet.description);
      setCode(initialSnippet.code);
      setDetails(initialSnippet.details);
      setTagsInput(initialSnippet.tags.join(', '));
    } else {
      setTitle('');
      setCategory('General');
      setDescription('');
      setCode('');
      setDetails('');
      setTagsInput('');
    }
  }, [initialSnippet, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const tags = tagsInput
      ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      : ['React', 'Snippet'];

    const snippetData: Snippet = {
      id: initialSnippet ? initialSnippet.id : `custom-${Date.now()}`,
      title,
      category,
      description,
      code,
      details: details || description,
      tags,
    };

    onAddSnippet(snippetData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] p-6 md:p-8 shadow-2xl flex flex-col my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {initialSnippet ? 'Edit Snippet' : 'Create New Snippet'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-active)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Glassmorphism Card Effect"
              className="w-full h-10 px-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="General">General</option>
                <option value="Languages & Web">Languages & Web</option>
                <option value="Mobile & Systems">Mobile & Systems</option>
                <option value="Knowledge & Tools">Knowledge & Tools</option>
                <option value="Favorites">Favorites</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, CSS, UI"
                className="w-full h-10 px-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this snippet does..."
              className="w-full h-10 px-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Code Block
            </label>
            <textarea
              required
              rows={5}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste or write your source code here..."
              className="w-full p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
              Detailed Notes / Explanation
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain how it works, props, or usage context..."
              className="w-full p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--bg-active)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{initialSnippet ? 'Save Changes' : 'Create Snippet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}