# Known Issues and Fix Later

Items are open unless marked done. Priority reflects what matters most for a portfolio project.

## Done
- Removed unused packages `@supabase/ssr`, `@supabase/supabase-js`, `@codesandbox/sandpack-react`.
- Page title and description in `app/layout.tsx` replaced the "Create Next App" defaults.
- CI workflow added at `.github/workflows/ci.yml`. It has not yet run on GitHub.
- Lighthouse run for light, coffee, and dark on the production build. All score 100 in all four categories.

## Open

| Priority | Issue | Why it matters | Next step |
|---|---|---|---|
| High | No tests for header, sidebar, mobile drawer, favorite and copy buttons | Most of the UI has no automated coverage | Add Testing Library tests; add a Playwright flow for favorites |
| High | Theme flashes on load for non-dark users | Visible glitch on every page load | Inline script in `<head>` sets `data-theme` before first paint |
| Medium | Seed-snippet edits and deletes last only for the session | Users expect edits to persist | Store seed overrides and hidden IDs in `localStorage` |
| Medium | `Sidebar.tsx` is about 755 lines | Hard to review and test | Split into category config, list rendering, filter logic |
| Low | No cloud sync or accounts | Data stays in one browser | Backend and sign-in (a future feature, not a bug) |
| Low | No error reporting | Errors in users' browsers go unseen | Add an error reporter such as Sentry |
| Low | CI has not been verified on GitHub | The workflow may need small fixes on first run | Push a branch and check the Actions tab |
