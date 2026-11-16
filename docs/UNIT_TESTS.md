# Unit and Component Test Record

Run with `npm test`. Last run: 20 of 20 passed, across 7 files.
Tool: Vitest with jsdom and Testing Library. Browser and accessibility tests are in `e2e/` and are recorded separately.

## Seed data (`data/snippets.test.ts`)

| # | Test | What it checks | Result |
|---|---|---|---|
| 1 | gives every snippet a unique id | No two seed snippets share an ID | Pass |
| 2 | gives every snippet a non-empty title, description, code, and at least one tag | Every seed snippet is complete | Pass |

## Storage wrapper (`utils/storage.test.ts`)

| # | Test | What it checks | Result |
|---|---|---|---|
| 3 | returns the fallback when the key is missing | Missing key returns the default value | Pass |
| 4 | parses stored JSON back into its original value | Saved values are read back correctly | Pass |
| 5 | returns the fallback and warns when stored JSON is malformed | Corrupt data doesn't crash the app | Pass |
| 6 | round-trips a value through set and get | Write then read returns the same value | Pass |
| 7 | swallows write errors such as a full quota and warns instead of throwing | A full or blocked `localStorage` doesn't crash the app | Pass |

## Profile menu (`components/ProfileMenu.test.tsx`)

| # | Test | What it checks | Result |
|---|---|---|---|
| 8 | shows the default name when nothing is saved | Initials of the default name appear on the avatar | Pass |
| 9 | shows the saved name from localStorage on the next render | A saved name replaces the default | Pass |
| 10 | Cancel discards the draft and keeps the saved name | Cancelled edits are not stored | Pass |
| 11 | Save stores the new name and title in localStorage | Saved edits are stored and shown on the avatar | Pass |

## Snippet modal (`components/NewSnippetModal.test.tsx`)

| # | Test | What it checks | Result |
|---|---|---|---|
| 12 | renders nothing when closed | Closed modal renders no DOM | Pass |
| 13 | does not save when title or code is empty | Required fields block saving | Pass |

## Command palette (`components/CommandPalette.test.tsx`)

| # | Test | What it checks | Result |
|---|---|---|---|
| 14 | runs a category action when a matching quick action is chosen | Typing "favorites" and choosing the action selects the Favorites category | Pass |

## Sandbox (`components/SandboxDrawer.test.tsx`)

| # | Test | What it checks | Result |
|---|---|---|---|
| 15 | runs the code in an iframe that cannot access the page origin | Runner iframe has `sandbox="allow-scripts"` and no same-origin access | Pass |
| 16 | shows the logs the runner reports back | Logs posted from the iframe appear in the output | Pass |
| 17 | ignores messages that do not come from its own iframe | Messages from other sources are rejected | Pass |

Note: jsdom does not run scripts inside iframes, so these tests post the runner's message themselves. Real execution is covered by the Playwright sandbox tests.

## Home page (`app/page.test.tsx`)

| # | Test | What it checks | Result |
|---|---|---|---|
| 18 | shows the seeded snippets on first load | Seed snippets render | Pass |
| 19 | narrows the list as the user types in search | Search filters the list | Pass |
| 20 | loads saved custom snippets alongside the seed data | Custom snippets from storage appear | Pass |
