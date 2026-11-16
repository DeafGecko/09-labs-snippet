'use client';

import React, { useState } from 'react';
import { X, Search, FolderKanban, Terminal, Smartphone, FileText, Link2, Command, Sparkles, BookOpen, Layers, Compass } from 'lucide-react';
import {
  HtmlCssIcon,
  JavaScriptIcon,
  ReactIcon,
  VueIcon,
  AstroIcon,
  ViteIcon,
  NextjsIcon,
  PythonIcon,
  GoIcon,
  RustIcon,
} from './TechIcons';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const sections = [
  {
    title: 'General',
    items: [
      { name: 'All Snippets', icon: FolderKanban, isCustom: false },
      { name: 'Installation', icon: Layers, isCustom: false },
      { name: 'CLI', icon: Terminal, isCustom: false },
    ],
  },
  {
    title: 'Languages & Web',
    items: [
      { name: 'HTML + CSS', icon: HtmlCssIcon, isCustom: true },
      { name: 'Javascript', icon: JavaScriptIcon, isCustom: true },
      { name: 'React', icon: ReactIcon, isCustom: true },
      { name: 'Vue', icon: VueIcon, isCustom: true },
      { name: 'Astro', icon: AstroIcon, isCustom: true },
      { name: 'Vite', icon: ViteIcon, isCustom: true },
      { name: 'Next.js', icon: NextjsIcon, isCustom: true },
    ],
  },
  {
    title: 'Mobile & Systems',
    items: [
      { name: 'React Native', icon: Smartphone, isCustom: false },
      { name: 'Expo', icon: Compass, isCustom: false },
      { name: 'Python', icon: PythonIcon, isCustom: true },
      { name: 'Go', icon: GoIcon, isCustom: true },
      { name: 'Rust', icon: RustIcon, isCustom: true },
    ],
  },
  {
    title: 'Knowledge & Tools',
    items: [
      { name: 'Notes', icon: FileText, isCustom: false },
      { name: 'Website link lists', icon: Link2, isCustom: false },
      { name: 'Icon Libraries', icon: Compass, isCustom: false },
      { name: 'Shortcut', icon: Command, isCustom: false },
      { name: 'Ai code', icon: Sparkles, isCustom: false },
      { name: 'Glossary', icon: BookOpen, isCustom: false },
    ],
  },
];

export default function MobileNavDrawer({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
}: MobileNavDrawerProps) {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 w-72 bg-[var(--bg-main)] h-full flex flex-col shadow-2xl">
        {/* Brand Header */}
        <div className="flex items-center justify-between h-[73px] px-4 shrink-0 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] font-bold text-lg shrink-0">
              09
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-[var(--text-primary)] leading-none">09 Labs</span>
              <span className="text-xs text-[var(--text-muted)] mt-1">Snippet Vault</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-(--border) shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-(--bg-surface) border border-(--border) text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent)"
            />
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-2 py-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                {section.title}
              </p>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = activeCategory === item.name;
                  const Icon = item.icon as React.ElementType;
                  return (
                    <button
                      key={item.name}
                      onClick={() => { onSelectCategory(item.name); onClose(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--bg-active)] text-[var(--text-primary)]'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${!item.isCustom && !isActive ? 'text-[var(--text-muted)]' : ''}`} />
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
