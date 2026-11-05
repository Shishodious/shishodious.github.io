# Studio revamp — implementation plan

Branch: `studio-revamp` (from `origin/main`, the branch GitHub Pages deploys).

**Goal.** The site stops being a full-stack-only portfolio and becomes a one-person
studio. A visitor lands on a chooser, picks what they need, and enters a story-driven
page for that service. They can switch services at any time.

**Services at launch.** Video Editing · Content Creation · Brand Websites ·
Apps & Products. More can be added later as a data-only change.

**Acceptance criteria.**
1. On `/`, the first screen is the chooser. Picking a service routes to `/video`,
   `/content`, `/brand` or `/apps`.
2. Each route loads directly on GitHub Pages: a hard refresh on a deep link works,
   with no 404 page.
3. A persistent switcher in the nav moves between services without a full reload,
   using a page transition.
4. Each service page has its own world (palette and motif) inside one shared shell:
   type, nav, grain and footer/contact.
5. Adding a service means a new registry entry, chapter data and assets.
   `App`, `NavBar` and the chooser need no code edits.
6. `prefers-reduced-motion` gets a calm path on every page: no scroll-jacking and no
   shader. Everything works from 360px wide upward.
7. Lighthouse mobile scores ≥ 85 for performance on every route, and LCP is under 2.5s
   on `/`.

**Non-goals.** No CMS and no backend: content lives in JS data files. No
Active-Theory-grade real-time 3D scenes with custom models. No Tailwind v4,
TypeScript or shadcn migration. No blog.

## Decisions
| # | Decision | Why |
|---|----------|-----|
| 1 | Single pick plus a persistent switcher | Your choice. Gives each page a strong story. |
| 2 | Shared shell, with each service as its own "world" via CSS variables on `[data-world]` | Your choice. Tailwind tokens (`bg`, `ink`, `accent`…) become `rgb(var(--x) / <alpha-value>)`, so existing classes keep working. |
| 3 | `react-router-dom` with `BrowserRouter`, and `index.html` copied to `dist/404.html` at build time | User site at root (`shishodious.github.io`), so no `base` is needed. Real URLs instead of `#/`. |
| 4 | Stay on GSAP and ScrollTrigger, and add **Lenis** for smooth scroll | GSAP is already the house motion library (`About`, `Services`, `Portfolio`…). No framer-motion. |
| 5 | Port 21st.dev picks by hand into JSX + Tailwind 3 + GSAP | Their components are TSX, Tailwind v4, shadcn and often Motion. Copying the idea beats installing the toolchain. |
| 6 | Use zero-dependency WebGL (raw or OGL) only for grain, haze and the dissolve transition, lazy-loaded | Gets most of the Santioni atmosphere for a few KB. three.js only if the P0 disc spike demands it. |
| 7 | Page = ordered list of **chapter** components, configured per service | This is what makes acceptance criterion 5 true. Chapters are reusable across worlds. |
| 8 | Video: short loops (≤ 4 MB, H.264 + WebM) in the repo. Full edits as YouTube or Vimeo embeds that load on click | GitHub Pages has a 100 MB per-file limit and no streaming, and embeds keep LCP fast. |
| 9 | Remember the last service in `localStorage`. The chooser still shows on `/`, with the last pick highlighted | Never trap a visitor. The gate is the brand moment. |

## Pattern donor & seam
- **Shell donor:** `src/App.jsx` (grain + NavBar + SocialLinks + `LazySection`). It
  becomes the layout route. `LazySection` stays the way chapters are mounted below the fold.
- **Motion donors:** `effects/bendingReel.js` (Portfolio reel), `effects/Lean.jsx`,
  `effects/liquid-glass/*`, and the inverting cards in `Services.jsx`. They are reused, not rewritten.
- **Content split of today's site:**
  - `/apps`: Home hero (re-copied), About, Skills, Experience, Portfolio (all
    current projects), and the Services cards for web apps, AI, backend, realtime
    and automation.
  - `/brand`: the E-commerce service card plus brand and site builds in the
    Portfolio reel, rebuilt in the light "A24 paper" world.
  - `Contact.jsx` is shared, with the subject pre-filled per service.

## Target structure (NEW unless noted)
```
src/services/registry.js     slug, name, tagline, world tokens, chooser media, chapters[]
src/services/{video,content,brand,apps}.js   per-service chapter data
src/worlds.css               [data-world="…"] variable sets
src/pages/Chooser.jsx        the gate on "/"
src/pages/ServicePage.jsx    reads registry and renders chapters inside LazySection
src/chapters/                Hero, DiscReel, ScrubVideo, Chapters (horizontal),
                             Domino, StackCards, Quotes, Process, CTA, …
src/shell/Layout.jsx         grain, NavBar (+ ServiceSwitcher), Lenis, transitions
src/components/effects/shaders/  gl.js, haze.js, dissolve.js (raw WebGL)
```

## Page concepts
- **`/` Chooser.** Santioni opens with an age gate, then splits into "Experience" and
  "Collection". This is the same gesture. Four oversized serif lines (VIDEO ·
  CONTENT · BRANDS · PRODUCTS) sit over a grainy light-leak haze. Hovering one
  previews that world's media and palette, and the wordmark rolls letter by letter
  (the `hover-members` / Circular Split Roll idea). Clicking it triggers the noise-dissolve
  transition into that world.
- **`/video`, dark cinema.** A scroll-locked hero that scrubs a showreel. Then the
  **A24 disc carousel**: each disc is an edit, with a credits block on the left
  (client, year, role), press-style quotes from clients underneath, and hand-drawn
  circles on the active disc. Then a before/after grade scrubber, and process.
- **`/content`, warm and social.** A phone-frame reel strip, and a domino-topple
  gallery of posts. Results are shown as handwritten annotations (marker circles,
  "+340% reach" scrawls), plus a formats and cadence chapter.
- **`/brand`, light paper (the A24 screenshot's look).** Horizontal chapter
  reveals with SplitText. Each site build is shown as a framed artefact, with a zoom
  parallax and a "how a brand site gets made" story.
- **`/apps`, today's black and orange.** The current site re-cut as the
  engineering world: the Momentum and Creator Vision case studies as stacking cards,
  with stack and experience kept.

## Phases

### P0 — Spikes (load-bearing unknowns)
- Q1: Do deep links and refresh work on Pages with the `404.html` copy? Kill criterion:
  if not, fall back to `HashRouter`.
- Q2: Can a CSS-3D disc carousel (textured `div`s plus `rotateX/Y`) hold 60fps on a
  mid-range phone with 7 discs? Kill criterion: if it drops below 50fps, use OGL quads.
- Q3: Do Lenis, ScrollTrigger and `LazySection` lazy mounts keep their pin positions
  correct? If not, run `ScrollTrigger.refresh()` on mount.
- Files: `scratch/` only, deleted after.
- Prove: a deployed preview URL, plus an fps readout from the browser pane on a mobile viewport.

**P0 results (2026-10-27)**
- Q1 ✅ The build serves `/video`, `/brand` and `/apps` as the app shell from `404.html`,
  tested on a local server that behaves like Pages. It has not been tested on the
  real Pages deploy yet. Pages returns a 404 *status* on deep links, which is fine
  for visitors; prerendering is deferred.
- Q2 ✅ The CSS-3D disc carousel holds a steady 60fps on desktop with 7 discs. It also
  renders correctly at 375px. Mobile fps can't be measured in the browser pane, so check
  it on a real phone in P4.
- Q3 ✅ Fixed in two places. `LazySection` now refreshes ScrollTrigger when a section's height
  settles. Nav links use `shell/sectionScroll` instead of react-scroll: the target moved
  while sections lazy-mounted mid-scroll, so the scroller re-aims on arrival.

### P1 — Walking skeleton
- Files: `package.json` (+ `react-router-dom`, `lenis`), `src/main.jsx`, `src/App.jsx`
  (becomes the router), `src/shell/Layout.jsx`, `src/services/registry.js`,
  `src/pages/Chooser.jsx` (plain list), `src/pages/ServicePage.jsx`,
  `tailwind.config.js` (variable tokens), `src/worlds.css`, `vite.config.js`
  (404 copy), and `NavBar.jsx` (+ switcher).
- Result: `/` lists four services. `/apps` renders today's full site unchanged.
  The other three show a hero placeholder in their own palette.
- Prove: `npm run build` and `npm run lint` pass. Drive all five routes in the browser
  pane, including a hard refresh on `/brand`.

### P2 — The chooser gate
- Files: `Chooser.jsx`, `components/effects/shaders/{gl,haze,dissolve}.js`, `shell/WorldTransition.jsx`,
  and `shell/Layout.jsx` (transition).
- Result: the full gate experience and the dissolve transition into each world, with a
  reduced-motion fallback (crossfade).
- Prove: record the gate in light and in reduced motion. Lighthouse on `/`.

### P3 — Apps + Brand (reusing what exists)
- Files: `services/apps.js` and `services/brand.js`. Chapters extracted from
  `About`, `Skills`, `Experience`, `Portfolio` and `Services`: the data moves into
  service files, and the components become chapters. New: `chapters/StackCards.jsx`,
  `chapters/Chapters.jsx` (horizontal), `chapters/ZoomParallax.jsx`.
- Result: two finished worlds.
- Prove: browser walkthrough at 375px and 1440px, and Lighthouse on both.

### P4 — Video world
- Files: `chapters/ScrubVideo.jsx`, `chapters/DiscReel.jsx` (approach chosen in P0),
  `chapters/Annotate.jsx` (SVG hand circles), `chapters/BeforeAfter.jsx`,
  `services/video.js`, `src/assets/video/`.
- Result: the A24-style disc reel driven by your samples.
- Prove: drag, scroll and keyboard on the reel. Check the asset sizes are within budget.

### P5 — Content world
- Files: `chapters/PhoneReel.jsx`, `chapters/Domino.jsx`, `services/content.js`.
- Prove: as in P4.

### P6 — Polish and ship
- Preloader, per-route `<title>` and meta, OG image, focus states, a reduced-motion
  pass, a 360px sweep, image `srcset`, and removing dead components.
- Prove: all acceptance criteria re-checked. Merge to `main` deploys.

## Risks & rollback
- **The Santioni bar.** That site is a WebGL build by Active Theory and Plan8.
  This plan matches its structure, pacing, typography and atmosphere, not bespoke 3D
  scenes. That needs 3D models and is listed under Deferred.
- **Media weight.** Budget: ≤ 4 MB per loop and ≤ 1.5 MB of JS per route (lazy chapters).
  Above that, move to an external host such as Bunny or Cloudflare Stream.
- **Scroll-jacking hurts usability.** Pins are limited to one or two per page, and
  reduced motion disables them.
- **Rollback.** Everything lives on `studio-revamp`, and `main` keeps deploying today's
  site until the merge.

## Deferred
Extra services (AI automation and so on), real-time 3D scenes, a CMS, case-study
detail pages per project, a booking or pricing calculator, and i18n.

## Inputs needed from you (each blocks only its phase)
- **P3:** 2–4 brand or site builds for `/brand` (URL and screenshot each). Tell me if
  any current Portfolio projects count.
- **P4:** a 20–40s showreel clip and 4–7 edits (poster frame, link, client, year,
  one-line quote).
- **P5:** 6–12 content pieces (reels or posts) with platform and a result metric.
- **Copy:** one sentence on the pitch for each service. I'll draft and you edit.
