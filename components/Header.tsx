'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Terminal,
  LayoutGrid,
  List,
} from 'lucide-react';

import ProfileMenu from './ProfileMenu';

interface HeaderProps {
  viewMode: 'grid' | 'list';
  onToggleView: (mode: 'grid' | 'list') => void;
  onOpenNewSnippet: () => void;
  onOpenSandbox: () => void;
  currentTheme: 'light' | 'coffee' | 'dark';
  onThemeChange: (theme: 'light' | 'coffee' | 'dark') => void;
}

export default function Header({
  viewMode,
  onToggleView,
  onOpenNewSnippet,
  onOpenSandbox,
  currentTheme,
  onThemeChange,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      className="
        flex
        items-center
        justify-between
        px-6
        py-4
        bg-(--bg-main)
        sticky
        top-0
        z-20
      "
    >
      {/* Search */}
      <div className="relative flex-1 max-w-xl mr-6">
        <Search
          className="
            absolute
            left-3.5
            top-1/2
            -translate-y-1/2
            w-4
            h-4
            text-[var(--text-muted)]
          "
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search snippets, tags, or glossary..."
          className="
            w-full
            pl-10
            pr-12
            py-2.5
            rounded-xl
            bg-[var(--bg-surface)]
            text-[var(--text-primary)]
            border
            border-[var(--border)]
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--accent)]
            text-sm
            transition-all
          "
        />

        <kbd
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            px-1.5
            py-0.5
            text-xs
            text-[var(--text-muted)]
            bg-[var(--bg-main)]
            border
            border-[var(--border)]
            rounded-md
            font-mono
          "
        >
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Sandbox */}
        <button
          onClick={onOpenSandbox}
          className="
            flex
            items-center
            gap-2
            px-3.5
            py-2.5
            text-sm
            font-medium
            rounded-xl
            bg-[var(--bg-surface)]
            text-[var(--text-primary)]
            border
            border-[var(--border)]
            hover:bg-[var(--bg-hover)]
            transition-colors
          "
        >
          <Terminal className="w-4 h-4 text-[var(--accent)]" />

          <span>Sandbox</span>
        </button>

        {/* New Snippet */}
        <button
          onClick={onOpenNewSnippet}
          className="
            flex
            items-center
            gap-2
            px-3.5
            py-2.5
            text-sm
            font-medium
            rounded-xl
            bg-[var(--accent)]
            text-white
            hover:opacity-90
            transition-opacity
          "
        >
          <Plus className="w-4 h-4" />

          <span> Snippet</span>
        </button>

        {/* Grid / List Toggle */}
        <div
          className="
            flex
            items-center
            p-1
            rounded-xl
            bg-[var(--bg-surface)]
            border
            border-[var(--border)]
          "
        >
          <button
            onClick={() => onToggleView('grid')}
            className={`
              p-1.5
              rounded-lg
              transition-colors

              ${
                viewMode === 'grid'
                  ? 'bg-[var(--bg-active)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              }
            `}
            aria-label="Grid View"
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleView('list')}
            className={`
              p-1.5
              rounded-lg
              transition-colors

              ${
                viewMode === 'list'
                  ? 'bg-[var(--bg-active)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              }
            `}
            aria-label="List View"
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Menu */}
        <ProfileMenu
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
          onOpenPreferences={() =>
            alert('Preferences Modal Open')
          }
          onOpenSubscription={() =>
            alert('Subscription & Billing Modal Open')
          }
          onOpenHistory={() =>
            alert('30-Day Activity History Modal Open')
          }
        />
      </div>
    </header>
  );
}