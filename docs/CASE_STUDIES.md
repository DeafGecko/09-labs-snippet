# 09 Labs: Case Studies

Written for: interview preparation. Every number below comes from a command I ran against this repo.

## Quick facts
- **What it is:** 09 Labs, a snippet vault and mini design system. Next.js 16, React 19, Tailwind v4, TypeScript.
- **Content:** 35 seeded snippets across about 20 categories. The sidebar groups them into four sections.
- **Data:** No backend. The user's own snippets, favorites, and theme live in `localStorage`.
- **Quality checks:** 20 unit and component tests (Vitest), 5 browser tests (Playwright), 3 accessibility tests (axe), ESLint with zero problems, TypeScript with no errors, a production build that passes, and Lighthouse at 100 in all four categories.

---

## Case study 1: Client-side CRUD with localStorage
**Problem:** Users need to create, edit, and delete their own snippets without a server.

**What I built:**
- Seed data lives in `data/snippets.ts`. User snippets are stored separately under `09labs-custom-snippets`, so the seed set is never overwritten.
- A `useStoredState` hook (`utils/useStoredState.ts`) reads and writes `localStorage` through `useSyncExternalStore`. Server and first client render both use the fallback, so hydration matches, and the saved value appears on the next render. No effect is needed.
- The profile menu edits drafts. Cancel leaves the saved profile unchanged.
- The storage wrapper (`utils/storage.ts`) catches and logs read and write errors, so a full or blocked `localStorage` doesn't crash the app.

**Trade-offs:** No sync across devices or tabs beyond the `storage` event. Seed-snippet edits and deletes last only for the session, which matches the original behavior.

---

## Case study 2: Three themes on CSS variables
**Problem:** Support Light, Coffee, and Dark themes that persist across visits, with WCAG AA contrast.

**What I built:**
- Colors are CSS custom properties, scoped per theme with `[data-theme='light' | 'coffee' | 'dark']` in `app/globals.css`. Components use tokens such as `--bg-surface`, `--accent`, and `--accent-contrast`.
- Switching themes changes one attribute on `<html>`.
- Each theme has its own `--accent-contrast` token for text on accent backgrounds. This fixed a real failure: white text on the dark theme's pale indigo measured 1.99:1.
- **Contrast check:** I computed the WCAG ratio for 13 text and background pairs per theme, 39 in total, using a short Python script. All pass 4.5:1. Axe then confirmed the rendered pages pass in all three themes.

**Weak spot:** The saved theme is applied after mount, so a non-dark user may briefly see the default. The fix is a small inline script in `<head>`.

---

## Case study 3: Responsive navigation
**Problem:** The sidebar is useful on desktop but takes too much room on phones.

**What I built:**
- Desktop (lg and up): a permanent sidebar.
- Mobile: a slide-over drawer and a scrollable category pill strip, both driven by the same category list.
- The pill strip is a labeled `<nav>` for screen readers.

**Weak spot:** `Sidebar.tsx` is about 755 lines. I would split it into category config, list rendering, and filter logic.

---

## Case study 4: Search, filters, and the Cmd+K palette
**Problem:** Find a snippet quickly by name, description, or tag.

**What I built:**
- One filter pass combines the active category, Favorites, and the search text across title, description, and tags.
- Cmd+K (Ctrl+K on Windows and Linux) opens a command palette. The palette mounts only while open, so each open starts with an empty query.

**Weak spot:** Filtering runs on every keystroke with no debounce. That's fine at 35 items.

---

## Case study 5: Accessibility, verified by three tools
**Problem:** Modals, forms, and the output area weren't usable with a keyboard or screen reader.

**What I built:**
- Dialogs have `role="dialog"`, `aria-modal`, and `aria-labelledby`. Form labels are connected to inputs. Close buttons have labels. Sandbox output uses `aria-live`.
- Card titles are `h2`, so the heading order runs correctly under the page `h1`.
- Contrast fixes described in case study 2.

**How I checked it:**
- **Lighthouse:** Accessibility went from 93 to 100 on the production build. Light, coffee, and dark all score 100.
- **axe (through Playwright):** Zero WCAG 2.0 and 2.1 A/AA violations on the home page in light, coffee, and dark.
- **Limit:** Lighthouse scores only the default theme. The axe run covers all three.

---

## Case study 6: Sandbox security fix
**Problem:** The sandbox ran user code with `eval()` in the page's own context. That code could read `localStorage` and the DOM. Also, if the code threw, `console.log` stayed replaced for the rest of the session.

**What I built:**
- Code now runs in an iframe with `sandbox="allow-scripts"` and no same-origin access, so it can't reach the page's storage or DOM.
- The iframe sends its logs back with `postMessage`. The parent accepts a message only if it comes from that iframe (`event.source` check).
- A new iframe per run means running the same code again actually runs it.

**How I checked it:**
- Unit tests check the iframe's sandbox attributes, that logs from the iframe are shown, and that messages from other sources are ignored.
- Playwright runs real code in the browser and checks the output (`hello 2`), and checks that a thrown error is reported.

---

## Case study 7: Testing and quality pipeline
**Problem:** The project had no tests and lint was broken. `next lint` was removed in Next 16, so `npm run lint` failed.

**What I built:**

| Layer | Tool | What it covers | Result |
|---|---|---|---|
| Unit and component | **Vitest** with jsdom and Testing Library | Storage wrapper, seed data, modal validation, command palette, sandbox, profile menu, page search, and saved custom snippets | 20 of 20 pass |
| Browser | **Playwright** (system Chrome) | Sandbox runs real code, and reports errors | 2 of 2 pass |
| Accessibility | **axe-core** through `@axe-core/playwright` | WCAG 2.0 and 2.1 A/AA on the home page, in each theme | 3 of 3 pass |
| Performance and SEO | **Lighthouse** on the production build, once per theme | Performance, accessibility, best practices, SEO | 100 in all four, in light, coffee, and dark |
| Lint | **ESLint** (flat config, `eslint-config-next`) | Whole project | 0 problems |
| Types | **TypeScript** (`tsc --noEmit`) | Whole project | Passes |
| Build | `next build` | Production bundle | Passes |

**Lint work:** Started with 10 problems. I fixed the `any` types, removed a stale eslint directive, and replaced the `eval` with the sandboxed iframe. The four "setState in effect" errors were not fixed by suppressing them. I changed the components so they mount only when open (command palette, snippet modal), and read `localStorage` through `useSyncExternalStore` (page and profile). Lint now reports zero.

**Tooling note:** I used Python scripts for two things: the contrast calculations and scripted find-and-replace edits. Python is not part of the app. The app is TypeScript.

**Scripts:** `npm test`, `npm run test:e2e`, `npm run lint`, `npm run typecheck`, and `npm run test:all`, which runs all of them.

---

## Open gaps
The full list, with priorities and next steps, is in [KNOWN_ISSUES.md](KNOWN_ISSUES.md). Every unit test is listed by name in [UNIT_TESTS.md](UNIT_TESTS.md).

## Weak spots to own
1. **Theme flash on load** (see case study 2).
2. **Seed-snippet edits don't persist** across reloads. Only custom snippets are saved.
3. **`Sidebar.tsx` is large** (see case study 3).
