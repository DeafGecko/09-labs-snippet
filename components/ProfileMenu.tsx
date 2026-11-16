'use client';

import { useState, useRef, useEffect } from 'react';
import { useStoredState } from '@/utils/useStoredState';
import Image from 'next/image';
import { 
  CreditCard, 
  History, 
  Moon, 
  Sun, 
  Coffee, 
  LogOut, 
  Upload,
  Edit2,
  Check,
  LayoutGrid,
  List
} from 'lucide-react';

interface ProfileMenuProps {
  currentTheme: 'light' | 'coffee' | 'dark';
  onThemeChange: (theme: 'light' | 'coffee' | 'dark') => void;
  onOpenSubscription: () => void;
  onOpenHistory: () => void;
  viewMode: 'grid' | 'list';
  onToggleView: (mode: 'grid' | 'list') => void;
}

export default function ProfileMenu({
  currentTheme,
  onThemeChange,
  onOpenSubscription,
  onOpenHistory,
  viewMode,
  onToggleView,
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useStoredState<string | null>('09labs-avatar', null);
  
  // Editable profile states
  const [name, setName] = useStoredState('09labs-name', 'Dwight Rogers');
  const [title, setTitle] = useStoredState('09labs-title', 'Front-End Engineer');
  const [draftName, setDraftName] = useState(name);
  const [draftTitle, setDraftTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Editing works on drafts, so Cancel leaves the saved profile alone
  const startEditing = () => {
    setDraftName(name);
    setDraftTitle(title);
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setName(draftName);
    setTitle(draftTitle);
    setIsEditing(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get initials for fallback avatar badge
  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Hidden file input for custom avatar selection */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Profile Trigger Button (Avatar Only) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-full overflow-hidden bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center font-bold text-sm shrink-0 border-2 border-transparent hover:border-[var(--accent)] transition-all shadow-xs focus:outline-none"
        title="Open Profile Menu"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150">

          {/* User Info & Editable Name/Title Section */}
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-start gap-3">
            <div className="relative group w-12 h-12 rounded-full overflow-hidden bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center font-bold text-base shrink-0 shadow-sm mt-1">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
              ) : (
                <span>{getInitials(name)}</span>
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[10px]"
                title="Change Avatar"
              >
                <Upload className="w-4 h-4 mb-0.5" />
                <span>Upload</span>
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {isEditing ? (
                <div className="space-y-2">
                  <input 
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-2 py-1 text-xs rounded bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                  <input 
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Professional Title"
                    className="w-full px-2 py-1 text-xs rounded bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button 
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-[var(--accent)] text-[var(--accent-contrast)] rounded hover:opacity-90 transition-opacity"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-2 py-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{name}</p>
                    <button 
                      onClick={startEditing}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 transition-colors"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] truncate">{title}</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-[var(--accent)] hover:underline mt-1 block font-medium"
                  >
                    Change avatar icon
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* View Mode Layout Toggle */}
          <div className="px-4 py-2 border-b border-[var(--border)]">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">View Layout</span>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              <button
                onClick={() => onToggleView('grid')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-transparent' 
                    : 'bg-[var(--bg-main)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>

              <button
                onClick={() => onToggleView('list')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-transparent' 
                    : 'bg-[var(--bg-main)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
            </div>
          </div>

          {/* Theme Switcher Options (Ordered: Light, Coffee, Dark) */}
          <div className="px-4 py-2 border-b border-[var(--border)]">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Theme Mode</span>
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              <button
                onClick={() => onThemeChange('light')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                  currentTheme === 'light' 
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-transparent' 
                    : 'bg-[var(--bg-main)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>

              <button
                onClick={() => onThemeChange('coffee')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                  currentTheme === 'coffee' 
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-transparent' 
                    : 'bg-[var(--bg-main)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Coffee</span>
              </button>
              
              <button
                onClick={() => onThemeChange('dark')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                  currentTheme === 'dark' 
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-transparent' 
                    : 'bg-[var(--bg-main)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Menu Options */}
          <div className="p-1 space-y-0.5">
            <button
              onClick={() => { setIsOpen(false); onOpenSubscription(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-main)] transition-colors"
            >
              <CreditCard className="w-4 h-4 text-[var(--text-muted)]" />
              <span>Subscription & Billing</span>
            </button>

            <button
              onClick={() => { setIsOpen(false); onOpenHistory(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-main)] transition-colors"
            >
              <History className="w-4 h-4 text-[var(--text-muted)]" />
              <span>30-Day Activity History</span>
            </button>
          </div>

          {/* Logout Footer */}
          <div className="p-1 border-t border-[var(--border)] mt-1">
            <button
              onClick={() => { setIsOpen(false); alert('Logged out successfully'); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}