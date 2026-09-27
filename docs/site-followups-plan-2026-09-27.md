# Site follow-ups · implementation plan

**Scope:** finish the five deferred improvements to `valentorassa.com` without changing the published identity of the September refactor. Work on a branch, verify a Vercel preview, then merge to `main`.

## Current state and constraints

- `main` is at `a75f579` and the live site has one shared menu, static pages for each talk, talk-specific social metadata, and a 404 for unknown talk IDs.
- The Charlas announcement is scheduled for **15 October** and the site-refactor announcement for **31 October**. Their screenshots show the current hero, profile, and phone menu. Preserve those views or refresh the scheduled assets before either publication.
- `/eventos` is linked from existing October announcements, including dates through **23 October**. A redirect before then would change their destination.
- The hub currently hides slide links until the talk's day in Argentina, but deck files already copied into `public/` can still be reached directly and can remain in Git history. UI hiding is not an access control.
- Baseline build on 27 September: shared `talkMedia` JS chunk **291.32 kB / 102.89 kB gzip**, home entry **30.62 kB / 8.67 kB gzip**, Charlas entry **18.97 kB / 6.61 kB gzip**, shared CSS **71.64 kB / 14.79 kB gzip**. Compare actual route downloads after the content split.

## Decisions to settle

| Decision | Recommended outcome | Why | If Valen chooses the alternative |
| --- | --- | --- | --- |
| Three header social links | Keep GitHub, LinkedIn, YouTube | They cover code, professional work, and long-form talks; the full set remains in the phone menu and hero. | Update the shared list once, then verify all three pages. |
| Agenda and Charlas | Keep `/eventos` and `/charlas` as separate pages, with clear cross-links | Agenda answers *when/where*; Charlas is a browsable archive with materials. Existing campaign URLs remain valid. | Prepare an explicit mapping and wait until after 23 October for redirects; verify hashes and canonicals. |
| Future deck access | Keep the existing public-file policy unless Valen wants actual withholding | The UI already waits until talk day, while the files are publicly reachable. This matches the earlier choice to publish the DevSecOps deck. | For **new** decks, stop copying them into the public repo until release day. Add a release workflow and tests; previously committed decks cannot be made secret by a URL rule. |

## Work sequence

### 1. Establish regression evidence

1. Capture current views at 1440×900 and 390×844 for `/`, `/eventos`, and `/charlas`, plus the open phone menu and a talk detail. Record current route requests and bundle sizes.
2. Run `npm run build`, `npm run lint`, and the existing Playwright suite before edits. Record failures rather than assuming a clean baseline.
3. Make a selector inventory for `src/index.css` and `src/charlas.css`: current JSX usage, repeated selectors, and legacy selectors. Check media queries and pseudo states before deleting a rule.

### 2. Decide site navigation and slide policy

1. Encode the chosen header links in one shared declaration, with the same three links on home, Agenda, and Charlas. Keep accessible names and focus styles.
2. Document the relationship between Agenda and Charlas in their visible copy/links. If keeping separate, preserve both canonical URLs, all existing event links, and `#proximas` / `#pasadas` anchors.
3. Encode the chosen deck policy as a single documented rule. For public files, say clearly in code that the release-day check controls the UI only. For withheld files, change the Brain export and site deployment together, with a release-day procedure and a direct-URL verification.

### 3. Improve the Charlas selector on phones

1. Add visible previous/next buttons at phone widths. Each control has a **44×44 px** hit area, an accessible label in Spanish/English, a disabled state at the ends, and no overlap with the slide action.
2. Add a horizontal swipe gesture to the hub selector or stage. A deliberate swipe changes one entry and updates `/charlas/<id>`; ordinary vertical page movement and taps do not. Ignore swipes that start on links or buttons.
3. Preserve keyboard arrows, year jumps, direct URLs, reduced-motion behavior, focus, and the existing horizontal selector scroll.

### 4. Separate route content and clean CSS

1. Move home-only text/data out of the module loaded by Agenda and Charlas. Keep shared types, social links, header/footer labels, and navigation in a small shared module; give home, Agenda, and Charlas their own content modules.
2. Confirm the Charlas route no longer downloads home-only content or image imports. Compare actual route bytes and build chunks with the baseline; keep the change only if it reduces unnecessary loading without duplicating large chunks.
3. Consolidate overrides into the original CSS rules. Remove only selectors proven unused by JSX and preview inspection; retain accessible states and responsive layouts. Keep the approved hero/profile/menu screenshots visually equivalent.

### 5. Verify and release

1. Run build, lint, targeted navigation/touch/deck tests, then the full E2E suite. Check the browser console and direct URLs on desktop and 390 px phone.
2. Compare before/after screenshots for the home hero, profile, phone menu, Agenda, Charlas, and a talk detail. Investigate any unexpected visual change.
3. Deploy a Vercel preview and verify `/`, `/eventos`, `/charlas`, one existing talk, an unknown talk (404), slide URLs, social metadata, language persistence, and the two announcement destinations.
4. Merge only the verified branch to `main`; check production and the publishing calendar. If a screenshot in the scheduled posts no longer matches production, replace that scheduled asset before its publication day.

## Acceptance checklist

- The three header links are intentional and identical across pages.
- The Agenda/Charlas relationship and URL policy are decided and documented; no existing October link breaks.
- The deck policy accurately describes public access and is tested against a direct URL.
- Phone users can change hub entries by visible buttons and swipe; keyboard and deep links still work.
- The Charlas route does not load home-only content; measured download size is recorded.
- CSS has no known dead blocks from the old layout, and approved desktop/mobile views remain stable.
- Build, lint, E2E, preview, and production checks pass; the two scheduled publications remain queued without conflicts.

## Implementation record · 27 September

The recommended navigation and deck choices were used for this implementation: GitHub, LinkedIn, and YouTube in the desktop header; separate `/eventos` and `/charlas` pages with links in both directions; public deck files whose links appear in the UI from the talk date. The deck rule is stated in code and verified by requesting a deck URL before its talk date. A different deck policy would require a separate export and release workflow for newly added files.

- Shared chrome, home copy, Agenda copy, and Charlas copy now live in separate modules. The Charlas page downloads no home-only company logos, portrait imports, or home text. The shared JavaScript chunk fell from **102.89 to 95.90 kB gzip**; the Charlas entry rose from **6.61 to 7.59 kB gzip**, giving a net reduction of about **6.0 kB gzip** for those two chunks. The home route stays close to its original total.
- Removed 53 unused CSS selectors from old hero, recognition, and hub layouts, plus dead keyframes and overridden declarations. Shared CSS fell from **14.79 to 13.89 kB gzip**; Charlas CSS from **3.17 to 2.98 kB gzip**. The home hero remained visually equivalent in 1440 px and 390 px screenshot comparisons.
- Charlas has 44×44 px previous/next controls below 900 px and a horizontal touch gesture on the visual stage. A 320 px check found no horizontal overflow or overlap; the mobile browser test verifies buttons, swipe, URL updates, and vertical movement.
- Build and lint passed. The full production-build browser suite passed: **54 passed, 36 skipped**. Desktop and phone screenshots of the three pages showed no JavaScript errors or horizontal overflow. The Agenda/Charlas changes are intentional visual differences.
- Release remains: verify the Vercel preview, merge the branch, verify production, and reconcile scheduled Charlas screenshots with the updated phone controls.
