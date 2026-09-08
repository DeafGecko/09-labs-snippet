'use client';

import { useEffect, useState } from 'react';
import { X, Copy, Check, Heart, Menu, MoreVertical, Terminal, Plus, Pencil, Trash2 } from 'lucide-react';

import Sidebar from '@/components/Sidebar';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import NewSnippetModal from '@/components/NewSnippetModal';
import SandboxDrawer from '@/components/SandboxDrawer';
import CommandPalette from '@/components/CommandPalette';
import ProfileMenu from '@/components/ProfileMenu';
import { allSnippets as initialSnippets, Snippet } from '@/data/snippets';
import { storage } from '@/utils/storage';

type Theme = 'light' | 'coffee' | 'dark';

export default function Home() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeCategory, setActiveCategory] = useState('All Snippets');
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [snippetToEdit, setSnippetToEdit] = useState<Snippet | null>(null);

  // Drawers & Modals States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isHeaderActionsDrawerOpen, setIsHeaderActionsDrawerOpen] = useState(false);
  const [isNewSnippetOpen, setIsNewSnippetOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Snippets State
  const [snippets, setSnippets] = useState<Snippet[]>(initialSnippets);

  // Quick copy & favorites states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalCopied, setModalCopied] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedTheme = storage.get('09labs-theme', 'dark') as Theme;
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedFavs = storage.get('09labs-favorites', []);
    if (Array.isArray(savedFavs)) {
      setFavorites(savedFavs);
    }

    const savedCustomSnippets = storage.get('09labs-custom-snippets', []);
    if (Array.isArray(savedCustomSnippets) && savedCustomSnippets.length > 0) {
      setSnippets([...initialSnippets, ...savedCustomSnippets]);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    storage.set('09labs-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSaveSnippet = (snippet: Snippet) => {
    let updatedList: Snippet[];
    const exists = snippets.some(s => s.id === snippet.id);
    if (exists) {
      updatedList = snippets.map(s => s.id === snippet.id ? snippet : s);
    } else {
      updatedList = [snippet, ...snippets];
    }
    setSnippets(updatedList);
    
    const customOnly = updatedList.filter(s => s.id.startsWith('custom-'));
    storage.set('09labs-custom-snippets', customOnly);
    setSnippetToEdit(null);
  };

  const handleDeleteSnippet = (id: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      const updatedList = snippets.filter(s => s.id !== id);
      setSnippets(updatedList);
      
      const customOnly = updatedList.filter(s => s.id.startsWith('custom-'));
      storage.set('09labs-custom-snippets', customOnly);
      setSelectedSnippet(null);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    storage.set('09labs-favorites', updated);
  };

  const handleCopyCode = (e: React.MouseEvent, id: string, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleModalCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 2000);
  };

  const filteredSnippets = snippets.filter(snippet => {
    const matchesCategory = activeCategory === 'All Snippets'
      ? true
      : activeCategory === 'Favorites'
      ? favorites.includes(snippet.id)
      : snippet.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch = searchQuery.trim() === '' || 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex relative overflow-x-hidden">
      {/* Permanent Sidebar visible only on Desktop (lg breakpoint and up) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
      </div>

      {/* Modular Mobile / Tablet Sidebar Navigation Drawer */}
      <MobileNavDrawer 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Vertical Fading Divider Line for Desktop */}
      <div className="absolute left-[280px] top-[30px] bottom-[30px] w-[1px] bg-gradient-to-b from-transparent via-[var(--border)] to-transparent pointer-events-none hidden lg:block z-20" />

      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-main)]">
        {/* Right-Side Slide-Over Menu for Mobile/Tablet Actions (Triggered by 3 dots) */}
        {isHeaderActionsDrawerOpen && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" 
              onClick={() => setIsHeaderActionsDrawerOpen(false)}
            />
            <div className="relative z-10 w-72 bg-[var(--bg-surface)] h-full flex flex-col shadow-2xl p-6 space-y-4 animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Quick Actions</span>
                <button 
                  onClick={() => setIsHeaderActionsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-active)] text-[var(--text-primary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsSandboxOpen(true);
                    setIsHeaderActionsDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-sm font-medium hover:border-[var(--accent)] transition-colors"
                >
                  <Terminal className="w-4 h-4 text-[var(--accent)]" />
                  <span>Sandbox</span>
                </button>

                <button
                  onClick={() => {
                    setSnippetToEdit(null);
                    setIsNewSnippetOpen(true);
                    setIsHeaderActionsDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Snippet</span>
                </button>

                <div className="pt-4 border-t border-[var(--border)]">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Profile & Settings</span>
                  <ProfileMenu 
                    currentTheme={theme} 
                    onThemeChange={handleThemeChange} 
                    viewMode={viewMode}
                    onToggleView={setViewMode}
                    onOpenSubscription={() => alert('Subscription modal coming soon')}
                    onOpenHistory={() => alert('Activity history modal coming soon')}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header Bar */}
        <header className="flex items-center justify-between bg-[var(--bg-main)] px-4 md:px-6 py-3 w-full shrink-0">
          {/* Left: Burger Menu (Visible on Tablet & Mobile < lg only) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[var(--bg-active)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Middle: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[var(--text-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search snippets, tags, or commands..."
                className="w-full h-10 pl-10 pr-14 rounded-xl bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              />
              <button
                onClick={() => setIsCmdOpen(true)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <kbd className="px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-active)] text-[var(--text-muted)] border border-[var(--border)]">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>

          {/* Right Side: Desktop Controls vs Mobile/Tablet Three Dots */}
          <div className="flex items-center gap-3">
            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setIsSandboxOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-sm font-medium hover:border-[var(--accent)] transition-colors shadow-sm"
              >
                <Terminal className="w-4 h-4 text-[var(--accent)]" />
                <span>Sandbox</span>
              </button>

              <button
                onClick={() => {
                  setSnippetToEdit(null);
                  setIsNewSnippetOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                <span>Snippet</span>
              </button>

              <ProfileMenu 
                currentTheme={theme} 
                onThemeChange={handleThemeChange} 
                viewMode={viewMode}
                onToggleView={setViewMode}
                onOpenSubscription={() => alert('Subscription modal coming soon')}
                onOpenHistory={() => alert('Activity history modal coming soon')}
              />
            </div>

            {/* Mobile / Tablet Three Dots Menu Trigger */}
            <button
              onClick={() => setIsHeaderActionsDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[var(--bg-active)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              aria-label="Open Actions Menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Category Filter Strip */}
        <nav aria-label="Category filters" className="lg:hidden w-full border-b border-(--border) bg-(--bg-main)">
          <div className="flex gap-2 overflow-x-auto px-4 py-2.5 scrollbar-none">
            {[
              'All Snippets', 'Installation', 'CLI',
              'HTML + CSS', 'Javascript', 'React', 'Vue', 'Astro', 'Vite', 'Next.js',
              'React Native', 'Expo', 'Python', 'Go', 'Rust',
              'Notes', 'Website link lists', 'Icon Libraries', 'Shortcut', 'Ai code', 'Glossary',
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-(--accent) text-white'
                    : 'bg-(--bg-active) text-(--text-muted) hover:text-(--text-primary)'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content Area with 20px Edge Padding on Tablet/Mobile */}
        <div className="p-5 md:p-8 w-full">
          {/* Page Heading */}
          <div className="flex items-center justify-between mb-8 w-full">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                {activeCategory}
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1.5">
                Explore, copy, and test front-end patterns in plain English.
              </p>
            </div>
          </div>

          {/* Empty State or Grid Cards */}
          {filteredSnippets.length === 0 ? (
            <div className="text-center py-20 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] w-full">
              <p className="text-sm text-[var(--text-muted)]">No snippets found matching your criteria.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full" : "flex flex-col gap-3 w-full"}>
              {filteredSnippets.map((snippet) => {
                const isFavorite = favorites.includes(snippet.id);

                return (
                  <article
                    key={snippet.id}
                    onClick={() => setSelectedSnippet(snippet)}
                    className={`group relative rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-(--accent) hover:shadow-lg hover:shadow-(--accent)/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-main) ${
                      viewMode === 'list' 
                        ? 'p-4 flex items-center justify-between gap-6' 
                        : 'p-8 flex flex-col justify-between'
                    }`}
                  >
                    {viewMode === 'list' ? (
                      /* ================= LIST VIEW LAYOUT ================= */
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider shrink-0">
                              {snippet.category}
                            </span>
                            <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                              {snippet.title}
                            </h3>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                            {snippet.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0" onClick={e => e.stopPropagation()}>
                          <div className="hidden sm:flex gap-1.5 flex-wrap justify-end max-w-[220px]">
                            {snippet.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-active)] text-[var(--text-muted)]">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <button
                            onClick={(e) => handleCopyCode(e, snippet.id, snippet.code)}
                            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-active)] transition-colors"
                            title="Copy Code"
                          >
                            {copiedId === snippet.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleToggleFavorite(e, snippet.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isFavorite 
                                ? 'bg-red-500/10 text-red-500' 
                                : 'bg-[var(--bg-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </>
                    ) : (
                      /* ================= GRID CARD LAYOUT ================= */
                      <>
                        <div>
                          <div className="absolute top-4 right-4 flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => handleToggleFavorite(e, snippet.id)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                isFavorite 
                                  ? 'bg-red-500/10 text-red-500' 
                                  : 'bg-[var(--bg-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                              }`}
                              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            >
                              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          <span className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider pr-12">
                            {snippet.category}
                          </span>

                          <h3 className="text-lg font-semibold mt-3 pr-12 text-[var(--text-primary)]">
                            {snippet.title}
                          </h3>

                          <p className="text-sm leading-6 text-[var(--text-muted)] mt-2">
                            {snippet.description}
                          </p>
                        </div>

                        <div className="pt-4 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1.5 flex-wrap">
                            {snippet.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-active)] text-[var(--text-muted)]">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <button
                            onClick={(e) => handleCopyCode(e, snippet.id, snippet.code)}
                            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-active)] transition-colors shrink-0"
                            title="Copy Code"
                          >
                            {copiedId === snippet.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedSnippet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <button
            type="button"
            onClick={() => setSelectedSnippet(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] cursor-default"
            aria-label="Close modal"
          />

          <div 
            role="dialog" 
            aria-modal="true" 
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] p-6 md:p-8 shadow-2xl flex flex-col my-auto"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                {selectedSnippet.category}
              </span>
              
              <div className="flex items-center gap-2">
                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSnippetToEdit(selectedSnippet);
                    setSelectedSnippet(null);
                    setIsNewSnippetOpen(true);
                  }}
                  className="p-2 rounded-xl bg-[var(--bg-active)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-1.5 px-3 text-xs font-medium"
                  title="Edit Snippet"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteSnippet(selectedSnippet.id)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-1.5 px-3 text-xs font-medium"
                  title="Delete Snippet"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSnippet(null)}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--bg-active)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] mt-2">
              {selectedSnippet.title}
            </h2>

            <p className="text-sm text-[var(--text-muted)] mt-1.5">
              {selectedSnippet.description}
            </p>

            <div className="mt-5 relative rounded-xl bg-[var(--bg-main)] border border-[var(--border)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-surface)]">
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Snippet Code</span>
                <button
                  onClick={() => handleModalCopy(selectedSnippet.code)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--bg-active)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  {modalCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 font-mono text-xs overflow-x-auto max-h-[40vh]">
                <pre className="whitespace-pre-wrap break-words">{selectedSnippet.code}</pre>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[var(--border)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Details</span>
              <p className="text-sm leading-6 text-[var(--text-primary)] mt-2">
                {selectedSnippet.details}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New / Edit Snippet Modal */}
      <NewSnippetModal
        isOpen={isNewSnippetOpen}
        onClose={() => {
          setIsNewSnippetOpen(false);
          setSnippetToEdit(null);
        }}
        onAddSnippet={handleSaveSnippet}
        initialSnippet={snippetToEdit}
      />

      {/* Sandbox Drawer */}
      <SandboxDrawer
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onSelectSnippet={(s) => setSelectedSnippet(s)}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />
    </main>
  );
}