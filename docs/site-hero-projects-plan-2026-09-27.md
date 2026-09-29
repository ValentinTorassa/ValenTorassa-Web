# valentorassa.com — hero and project showcase plan

Prepared 27 September 2026. This is a local proposal for review; it does not change the live site or scheduled posts.

**Selection revision:** Valen asked to replace VT-Agent-Firewall in the showcase. VT Security Fixes now takes that card. The agent-firewall repo is outside the Projects section.

## What I reviewed

- The current English and Spanish hero, Profile, and Projects implementation in `ValenTorassa-Web`, plus the latest 1440 px and 390 px production-build screenshots.
- The authenticated GitHub inventory for `ValentinTorassa`: **28 public and 23 private repositories**. All 28 public repositories were classified below; private repositories were counted but are not candidates for public cards. This is a portfolio scan, not a full code audit of 51 repositories.
- Local READMEs, file trees, and selected implementation for the leading public candidates. The older 17 September repository audit supplied useful claim-boundary checks; I rechecked AutoConfine's tracer selection and the Podman pull request today.

## Diagnosis

1. The hero's `Teramot · cloud security, backend, and AI agents` pill gives a **32 px portrait** equal billing with a long status string. It wraps on a 390 px phone. The role below the name and the Profile/Experience copy repeat much of the same message.
2. The centered name, Tux, and dark technical scene already have a clear identity. The status pill, `whoami` prompt, two buttons, and eight social icons compete for attention before any work is shown.
3. Projects currently show Open Security Labs, Terminal, IDE, and SecretShare. Terminal and IDE are popular developer setup projects, but the selection hides newer public engineering work on Linux security maintenance, a production publishing app, Linux USB devices, and Rust process/network inspection.
4. Stars, forks, and update dates dominate card footers. Their fallback numbers are stale, and refreshing them through the unauthenticated GitHub API can hit rate limits. Project decisions and evidence are stronger portfolio signals.

## Hero ideas

| Direction | First screen | Advantage | Tradeoff |
| --- | --- | --- | --- |
| **A. Builder first — recommended** | Small `SECURITY / BACKEND / SYSTEMS` eyebrow; name; one sentence about what you build; **Projects** and **Contact** buttons; three intentional links. No portrait in the hero. | Keeps the centered layout Valen chose and leads directly to work. Short enough for phones. | Less explicit employer branding on the first screen; Teramot remains in Experience. |
| B. Three capabilities | Name and concise sentence above three small labels: `Build`, `Secure`, `Explain`, each linked to evidence. | Ties the site to engineering, security, and teaching. | More content above the fold; risks becoming another stack list. |
| C. Work preview | Name and sentence beside two tiny previews of SecretShare and Ragnaros. | Evidence appears immediately. | Crowds the 390 px hero and competes with Tux/scene; needs more media and careful loading. |

### Recommended hero copy and layout

```text
SECURITY / BACKEND / SYSTEMS

Valentín Torassa Colombero

I build secure backends and Linux tools, then explain how the systems work.

[Explore projects]  [Contact]

GitHub  ·  LinkedIn  ·  YouTube
```

Spanish sentence: **“Construyo backends seguros y herramientas para Linux, y explico cómo funcionan por dentro.”** Keep the name accented in both languages. If that sentence feels too long at 320 px, shorten it to **“Construyo sistemas seguros y explico cómo funcionan.”**

- Remove the portrait/status pill from the hero. Use Teramot in the Experience section, where the exact role and dates are explained. Do not relocate the portrait elsewhere as part of this change.
- Remove the `whoami` prompt above the name; the Profile section already has the terminal card. Keep the Tux and subtle scene at the sides, clear of text.
- Make **Explore projects / Ver proyectos** the primary CTA to `#research`; keep Contact as the second. Keep Charlas and Agenda available through the shared menu. Show only GitHub, LinkedIn, and YouTube in the hero, matching the approved header set; the full contact set can stay in Contact.
- At 320–390 px: eyebrow on one line; name in two or three deliberate lines; sentence at a readable size; buttons at least 44 px high; no horizontal overflow. Check both languages and reduced motion.

## Project section — what to exhibit

Rename the visible heading to **Selected work / Proyectos seleccionados**, while preserving `#research` and the menu destination. Show **six substantive projects**, then a short additional-work strip. A card answers: *what problem, what engineering decision, where can I verify it?* Keep the current case-study drawer only if it remains keyboard and screen-reader friendly.

| Placement | Public project | What the card should prove | Honest boundary / evidence to prepare |
| --- | --- | --- | --- |
| Wide flagship | [Open Security Labs](https://github.com/ValentinTorassa/Open-Security-Labs) | Open Spanish labs as versioned Astro content, with practical Linux/network/backend/security learning paths. | Use the current original site preview; verify its canonical live URL before linking. |
| Lead card | [VT Security Fixes](https://github.com/ValentinTorassa/VT-Security-Fixes) | DEP-3 patches for Ubuntu `universe` CVEs, with upstream provenance and per-package status records. | Call these **prepared patch candidates**, not released Ubuntu fixes. `fixes.yaml` was last reviewed on 14 September; recheck each tracker before writing a card. A small patch-provenance diagram can explain the work without a stock image. |
| Lead card | [VT-SecretShare](https://github.com/ValentinTorassa/VT-SecretShare) | Browser-side encryption plus atomic one-read consumption in Go/Redis. | Say **client-side encrypted, single-use links** instead of making an absolute security guarantee. Use a fake secret in any screenshot. |
| Standard card | [pluma](https://github.com/ValentinTorassa/pluma) | One Next.js codebase serving isolated publishing tenants, admin workflows, and scoped API access. | Use the VT Security tenant or synthetic article content for imagery; do not display another person's admin or data. |
| Standard card | [VT-Ragnaros](https://github.com/ValentinTorassa/VT-Ragnaros) | Reverse-engineered userspace USB protocol, Linux daemon, event mapping, and systemd integration. | Call it a **userspace driver/daemon**, not a kernel driver. Use Valen's own device photo/video or a code-native protocol diagram, not bundled third-party character art. |
| Standard card | [VT-Lens](https://github.com/ValentinTorassa/VT-Lens) | Rust GUI for local process/socket inspection and evidence export. | Describe it as an educational instrument, not an EDR. Use synthetic telemetry in screenshots. Do not claim data never leaves the machine: the optional LLM request path needs a privacy review. |

**Additional-work strip:** link the [merged Podman `manifest push --retry` pull request](https://github.com/podman-container-tools/podman/pull/28637) as an upstream contribution, and Terminal/IDE as smaller developer-setup links. Never imply the Podman fork is an original product. Keep a clear **View all GitHub repositories** link.

Move Terminal and IDE out of the main six. They can live as two small links under “Developer setup” if there is room; they should not crowd out security/backend case studies. **Do not include VT-Agent-Firewall anywhere in the Projects section**; its related talk can link to the repo separately if useful. `podman-watchguard` is a possible future infrastructure card after its real hardware deployment and service status are evidenced.

### Card content rules

- One-sentence outcome, two or three technology/role tags, a visible project state when relevant (`patch collection`, `desktop app`, `live site`), and direct **Code / Demo / Case study** links only where those destinations exist.
- Replace stars/forks/updated-at with one concrete proof point per project: test suite, architecture diagram, running public site, release, or merged PR. Remove the client-side GitHub metadata request if the counters are no longer displayed.
- Use an original image only when it explains the work. Otherwise use a small SVG/code-native diagram. Keep images lazy below the fold and reserve dimensions to prevent layout shift.
- On desktop: one wide flagship, two lead cards, three equal standard cards, then additional work. On phones: a single vertical column in the same order; no carousel or hidden tabs. Keep each primary card short, with details behind an accessible disclosure or link.

## Complete public inventory decision

The authenticated account currently exposes **28 public repositories**. This classification is about portfolio placement, not project quality.

| Decision | Repositories | Reason |
| --- | --- | --- |
| Six main cards | Open-Security-Labs, VT-Security-Fixes, VT-SecretShare, pluma, VT-Ragnaros, VT-Lens | Best combined evidence for teaching, Linux security maintenance, backend, product architecture, Linux devices, and Rust. |
| Outside main cards | VT-Agent-Firewall, VT-Terminal-Project, VT-IDE-Project, podman-watchguard | The agent-security lab belongs, if linked, with its related talk; developer setup can use compact links, and the hardware prototype needs separate evidence. |
| Revisit after a claim or evidence update | AutoConfine, PhantomLog, ShellFusion-mcp-server, TaskVault, Proyecto-Prometeo | AutoConfine's current `NewTracer` selects `NewNoopProbe`, while the README leads with live eBPF observation. The others need a clearer current state, demo, tests, or case-study narrative before being promoted. |
| Supporting/older work | ValenTorassa-Web, ValentinTorassa, Linux-Study-Notes-VT, BotTelegram-Freshdesk-Notifier, Valen-Go-Playground, HarryPotterMineSweeper-DAW, Hyper-v-Backup-PowerShell, Atlas-Api-Back-y-Front-End, FunkoShop, CreadorTorneoCSEntity | Useful history, study material, or site infrastructure; not the clearest first six for this professional story. Attribute collaborative work precisely. |
| Forks | podman, deepsec, sap_tfi_2026 | Do not present forks as original products. The specific merged Podman contribution can be credited separately. |

The **23 private** account repositories were counted in the scan and excluded from the proposed public site. A separate approval and sanitized case study would be needed before showcasing private, personal, employer, or client work.

## Execution order and release checks

1. **Copy and proof pass:** confirm exact project states and public destinations; write Spanish and English card text; collect only original or synthetic visuals; update the Open Security Labs canonical URL. Recheck the three VT Security Fixes tracker entries and describe only what has actually shipped; resolve the VT-Lens privacy boundary and avoid the AutoConfine eBPF claim.
2. **Hero implementation:** remove portrait/status and top `whoami`; add the recommended copy and three links; keep the approved centered composition and shared navigation. Verify 320, 390, 820, and 1440 px.
3. **Projects implementation:** model six cards and the separate additional-work strip; remove stale GitHub counters/fetch; preserve `#research`, keyboard navigation, focus return from any drawer, and external-link labels. Check that media stays lightweight.
4. **Visual and functional review:** compare both languages on phone and desktop; test route and anchor links, keyboard/focus, reduced motion, no horizontal overflow, image loading, and browser console. Use the existing build, lint, and Playwright gates.
5. **Release and campaign alignment:** merge after preview review, then capture the new desktop and phone hero and projects area. The **31 October site-refactor post** currently contains the old hero screenshot; replace its queued media and verify previews before that post goes live. Leave the **15 October Charlas** assets alone unless this work visibly changes Charlas.

**Acceptance:** the hero has no left-side portrait pill, names the work in one readable sentence, and links directly to projects; six cards accurately represent public code and its limits; the project section remains usable at phone widths; the 31 October publication shows the released design.
