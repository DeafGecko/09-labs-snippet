# 09 Labs - Component Library & Code Snippet Vault

A high-performance, responsive code snippet manager and component design system built with Next.js, Tailwind CSS, and robust browser-level state persistence.

## What I Built

**09 Labs** is a modular component library and design system created to streamline front-end development across future projects. The core philosophy is simple:

> **Design -> Build -> Reuse**

Instead of recreating navigation bars, modals, cards, and form controls from scratch for every new application, 09 Labs centralizes these components into a unified, clean, and interactive system.

## Design Direction

The project achieves a balance between clean minimalism and rich personality through:

- **Minimal Structure**: Uncluttered layouts with responsive single-click drawers and intuitive grid/list view modes.
- **Strong Typography**: Optimized text hierarchy paired with code block formatting.
- **Creative Details**: Custom color themes (Light, Coffee, and Dark) featuring WCAG AA-compliant contrast ratios.
- **Purposeful Motion**: Smooth slide-over navigation drawers, command palettes (`Cmd+K`), and interactive modal states.

## Why I Built It

As front-end requirements evolve, maintaining consistency across multiple applications becomes challenging. 09 Labs bridges design and engineering by standardizing:

- Color and theme design tokens
- Typography scales and responsive padding
- Reusable React components and modular layouts
- Full client-side CRUD capabilities (Create, Read, Update, Delete) via robust `localStorage` data structures

## Core Features

- **Advanced Navigation & Search**: Sidebar categorization across General, Languages & Web, Mobile & Systems, and Knowledge & Tools, paired with a global Command Palette (`Cmd+K`).
- **Complete Snippet Management**: Create, view, edit, and delete custom snippets with real-time error handling and state persistence.
- **Interactive Sandbox & Favorites**: Test patterns on the fly and bookmark essential snippets for instant access.
- **Multi-Theme Support**: Seamless switching between Light, Coffee, and Dark modes with persistent user preferences.

## Getting Started

Clone the repository and install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000/) in your browser to explore the vault.

## Testing & Quality

Case studies, open issues, and the unit test record are in [docs/](docs/).

| Check | Command | Tool | Coverage |
|---|---|---|---|
| Unit & component tests | `npm test` | Vitest, jsdom, Testing Library | 20 tests across 7 files: storage wrapper, seed data integrity, modal, command palette, sandbox, profile menu, and page-level search and saved snippets |
| Browser tests | `npm run test:e2e` | Playwright (system Chrome) | 2 sandbox tests: user code runs in the real browser and shows its output, and a thrown error is reported |
| Accessibility | `npm run test:e2e` | axe-core via `@axe-core/playwright` | 3 tests, one each for light, coffee, and dark: no WCAG 2.0 and 2.1 A/AA violations on the home page |
| Lint | `npm run lint` | ESLint (flat config, `eslint-config-next`) | Zero problems |
| Types | `npm run typecheck` | TypeScript | Passes |
| Performance & SEO | Lighthouse on `npm run build && npm start` | Lighthouse | Performance, accessibility, best practices, and SEO all score 100 on the production build, in light, coffee, and dark themes |

Run everything at once with `npm run test:all`. The Playwright tests start the dev server on port 3000 if it isn't already running, and they use the Chrome installed on your machine.

## Status

**Pre-Launch / Portfolio Polish** (Active Phase)
