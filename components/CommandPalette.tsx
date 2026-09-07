'use client';

import { useEffect, useState, useRef } from 'react';
import { Search, Heart, FileCode, Folder, X } from 'lucide-react';
import { allSnippets, Snippet } from '@/data/snippets';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSnippet: (snippet: Snippet) => void;
  onSelectCategory: (category: string) => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectSnippet,
  onSelectCategory,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'action-favorites',
      title: 'Go to Favorites',
      type: 'category',
      value: 'Favorites',
      icon: Heart,
    },
    {
      id: 'action-all',
      title: 'All Snippets',
      type: 'category',
      value: 'All Snippets',
      icon: Folder,
    }
  ].filter(action => action.title.toLowerCase().includes(query.toLowerCase()));

  const matchingSnippets = allSnippets.filter(
    s => 
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center pt-20 px-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-[var(--border)]">
          <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search snippets..."
            className="w-full h-14 px-3 bg-transparent text-[var(--text-primary)] text-sm focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-active)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {quickActions.length > 0 && (
            <div className="px-3 py-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Quick Links
            </div>
          )}
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => {
                  onSelectCategory(action.value);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-active)] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors">
                  <IconComponent className="w-4 h-4" />
                </div>
                <span>{action.title}</span>
              </button>
            );
          })}

          <div className="px-3 py-1.5 mt-2 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Snippets ({matchingSnippets.length})
          </div>
          {matchingSnippets.length === 0 ? (
            <div className="text-center py-8 text-sm text-[var(--text-muted)]">
              No matching snippets found.
            </div>
          ) : (
            matchingSnippets.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => {
                  onSelectSnippet(snippet);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-active)] transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors shrink-0">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{snippet.title}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{snippet.category}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}