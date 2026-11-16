'use client';

import { useState } from 'react';

import {
  FolderKanban,
  Terminal,
  Smartphone,
  FileText,
  Link2,
  Command,
  Sparkles,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Compass,
  Menu,
  X,
} from 'lucide-react';

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

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  forceExpanded?: boolean;
}

export default function Sidebar({
  activeCategory,
  onSelectCategory,
  forceExpanded = false,
}: SidebarProps) {
  const [_isExpanded, setIsExpanded] = useState(true);
  const isExpanded = forceExpanded || _isExpanded;

  const [isMobileOpen, setIsMobileOpen] =
    useState(false);

  const [collapsedSections, setCollapsedSections] =
    useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    if (!isExpanded) return;

    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const sections = [
    {
      title: 'General',

      items: [
        {
          name: 'All Snippets',
          icon: FolderKanban,
          isCustom: false,
        },

        {
          name: 'Installation',
          icon: Layers,
          isCustom: false,
        },

        {
          name: 'CLI',
          icon: Terminal,
          isCustom: false,
        },
      ],
    },

    {
      title: 'Languages & Web',

      items: [
        {
          name: 'HTML + CSS',
          icon: HtmlCssIcon,
          isCustom: true,
        },

        {
          name: 'Javascript',
          icon: JavaScriptIcon,
          isCustom: true,
        },

        {
          name: 'React',
          icon: ReactIcon,
          isCustom: true,
        },

        {
          name: 'Vue',
          icon: VueIcon,
          isCustom: true,
        },

        {
          name: 'Astro',
          icon: AstroIcon,
          isCustom: true,
        },

        {
          name: 'Vite',
          icon: ViteIcon,
          isCustom: true,
        },

        {
          name: 'Next.js',
          icon: NextjsIcon,
          isCustom: true,
        },
      ],
    },

    {
      title: 'Mobile & Systems',

      items: [
        {
          name: 'React Native',
          icon: Smartphone,
          isCustom: false,
        },

        {
          name: 'Expo',
          icon: Compass,
          isCustom: false,
        },

        {
          name: 'Python',
          icon: PythonIcon,
          isCustom: true,
        },

        {
          name: 'Go',
          icon: GoIcon,
          isCustom: true,
        },

        {
          name: 'Rust',
          icon: RustIcon,
          isCustom: true,
        },
      ],
    },

    {
      title: 'Knowledge & Tools',

      items: [
        {
          name: 'Notes',
          icon: FileText,
          isCustom: false,
        },

        {
          name: 'Website link lists',
          icon: Link2,
          isCustom: false,
        },

        {
          name: 'Icon Libraries',
          icon: Compass,
          isCustom: false,
        },

        {
          name: 'Shortcut',
          icon: Command,
          isCustom: false,
        },

        {
          name: 'Ai code',
          icon: Sparkles,
          isCustom: false,
        },

        {
          name: 'Glossary',
          icon: BookOpen,
          isCustom: false,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div
      className="
        flex
        flex-col
        h-full
        justify-between
        bg-[var(--bg-main)]
      "
    >
      <div>
        {/* Brand Header */}
        <div
          className={`
            flex
            items-center
            h-[73px]
            px-3

            ${
              isExpanded
                ? 'justify-between'
                : 'justify-center'
            }
          `}
        >
          <div
            className="
              flex
              items-center
              gap-3
              overflow-hidden
              cursor-pointer
            "
            onClick={() =>
              setIsExpanded(!isExpanded)
            }
          >
            <div
              className="
                flex
                items-center
                justify-center
                w-10
                h-10
                rounded-xl
                bg-[var(--accent)]
                text-[var(--accent-contrast)]
                font-bold
                text-lg
                shrink-0
              "
            >
              09
            </div>

            {isExpanded && (
              <div className="flex flex-col truncate">
                <span
                  className="
                    font-bold
                    text-base
                    text-[var(--text-primary)]
                    leading-none
                    truncate
                  "
                >
                  09 Labs
                </span>

                <span
                  className="
                    text-xs
                    text-[var(--text-muted)]
                    mt-1
                    truncate
                  "
                >
                  Snippet Vault
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse */}
          {isExpanded && (
            <button
              onClick={() =>
                setIsExpanded(false)
              }
              className="
                hidden
                lg:flex
                p-1.5
                rounded-lg
                text-[var(--text-muted)]
                hover:text-[var(--text-primary)]
                hover:bg-[var(--bg-hover)]
                transition-colors
                shrink-0
              "
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Close */}
          <button
            onClick={() =>
              setIsMobileOpen(false)
            }
            className="
              lg:hidden
              p-1.5
              rounded-lg
              text-[var(--text-muted)]
              hover:text-[var(--text-primary)]
              hover:bg-[var(--bg-hover)]
              transition-colors
              shrink-0
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Expand button */}
        {!isExpanded && (
          <div
            className="
              hidden
              lg:flex
              justify-center
              py-2
            "
          >
            <button
              onClick={() =>
                setIsExpanded(true)
              }
              className="
                p-1.5
                rounded-lg
                text-[var(--text-muted)]
                hover:text-[var(--text-primary)]
                hover:bg-[var(--bg-hover)]
                transition-colors
              "
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <div
          className="
            p-3
            space-y-4
            overflow-y-auto
            max-h-[calc(100vh-145px)]
          "
        >
          {sections.map((section) => {
            const isCollapsed =
              collapsedSections[section.title];

            return (
              <div
                key={section.title}
                className="space-y-1"
              >
                {(isExpanded ||
                  isMobileOpen) && (
                  <button
                    onClick={() =>
                      toggleSection(
                        section.title
                      )
                    }
                    className="
                      w-full
                      flex
                      items-center
                      justify-between
                      px-2
                      py-1.5
                      text-[11px]
                      font-semibold
                      text-[var(--text-muted)]
                      uppercase
                      tracking-wider
                      hover:text-[var(--text-primary)]
                      transition-colors
                      rounded-md
                    "
                  >
                    <span className="truncate">
                      {section.title}
                    </span>

                    {isCollapsed ? (
                      <ChevronRight
                        className="
                          w-3.5
                          h-3.5
                          text-[var(--text-muted)]
                          shrink-0
                        "
                      />
                    ) : (
                      <ChevronDown
                        className="
                          w-3.5
                          h-3.5
                          text-[var(--text-muted)]
                          shrink-0
                        "
                      />
                    )}
                  </button>
                )}

                {(!isCollapsed ||
                  (!isExpanded &&
                    !isMobileOpen)) && (
                  <nav className="space-y-1">
                    {section.items.map(
                      (item) => {
                        const isActive =
                          activeCategory ===
                          item.name;

                        const IconComponent = item.icon;

                        return (
                          <button
                            key={item.name}
                            onClick={() => {
                              onSelectCategory(
                                item.name
                              );

                              setIsMobileOpen(
                                false
                              );
                            }}
                            title={
                              !isExpanded &&
                              !isMobileOpen
                                ? item.name
                                : undefined
                            }
                            className={`
                              w-full
                              flex
                              items-center
                              gap-3
                              px-3
                              py-2.5
                              rounded-xl
                              text-sm
                              font-medium
                              transition-colors

                              ${
                                isActive
                                  ? `
                                    bg-[var(--bg-active)]
                                    text-[var(--text-primary)]
                                  `
                                  : `
                                    text-[var(--text-primary)]
                                    hover:bg-[var(--bg-hover)]
                                  `
                              }

                              ${
                                !isExpanded &&
                                !isMobileOpen
                                  ? 'justify-center'
                                  : ''
                              }
                            `}
                          >
                            {item.isCustom ? (
                              <IconComponent
                                className="
                                  w-6
                                  h-6
                                  shrink-0
                                "
                              />
                            ) : (
                              <IconComponent
                                className={`
                                  w-6
                                  h-6
                                  shrink-0

                                  ${
                                    isActive
                                      ? 'text-[var(--text-primary)]'
                                      : 'text-[var(--text-muted)]'
                                  }
                                `}
                              />
                            )}

                            {(isExpanded ||
                              isMobileOpen) && (
                              <span className="truncate">
                                {item.name}
                              </span>
                            )}
                          </button>
                        );
                      }
                    )}
                  </nav>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Storage */}
      <div
        className="
          p-3
          bg-[var(--bg-surface)]
          m-3
          rounded-xl
        "
      >
        {isExpanded ||
        isMobileOpen ? (
          <>
            <div
              className="
                flex
                items-center
                justify-between
                text-xs
                text-[var(--text-muted)]
              "
            >
              <span>
                Storage Usage
              </span>

              <span
                className="
                  font-medium
                  text-[var(--text-primary)]
                "
              >
                14 / 100
              </span>
            </div>

            <div
              className="
                w-full
                bg-[var(--bg-active)]
                h-1.5
                rounded-full
                mt-2
                overflow-hidden
              "
            >
              <div
                className="
                  bg-[var(--accent)]
                  h-full
                  w-[14%]
                "
              />
            </div>
          </>
        ) : (
          <div
            className="
              flex
              justify-center
              text-xs
              text-[var(--text-muted)]
              font-medium
            "
            title="14 / 100 Storage"
          >
            14%
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div
        className="
          lg:hidden
          flex
          items-center
          justify-between
          px-4
          h-[73px]
          bg-[var(--bg-main)]
          sticky
          top-0
          z-40
          w-full
        "
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setIsMobileOpen(true)
            }
            className="
              p-2
              rounded-lg
              text-[var(--text-primary)]
              hover:bg-[var(--bg-hover)]
              transition-colors
            "
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <div
              className="
                flex
                items-center
                justify-center
                w-8
                h-8
                rounded-lg
                bg-[var(--accent)]
                text-[var(--accent-contrast)]
                font-bold
                text-sm
              "
            >
              09
            </div>

            <span
              className="
                font-bold
                text-base
                text-[var(--text-primary)]
              "
            >
              09 Labs
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() =>
            setIsMobileOpen(false)
          }
          className="
            fixed
            inset-0
            bg-black/40
            z-50
            lg:hidden
            backdrop-blur-xs
            transition-opacity
          "
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-72
          bg-[var(--bg-main)]
          transform
          transition-transform
          duration-300
          ease-in-out
          lg:hidden

          ${
            isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden
          lg:flex

          ${
            isExpanded
              ? 'w-64'
              : 'w-20'
          }

          h-screen
          sticky
          top-0
          bg-[var(--bg-main)]
          flex-col
          justify-between
          shrink-0
          transition-all
          duration-300
          z-30
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}