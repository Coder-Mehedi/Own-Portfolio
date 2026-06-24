# Mehedi Hasan — Portfolio

An Awwwards-caliber personal portfolio for a Senior Frontend Engineer specializing in React, Next.js, TypeScript, and AI-powered interfaces. Dark-first, type-driven, and fully animated — built to feel handcrafted, not templated.

## Highlights

- **Connected-node WebGL hero** — a Three.js particle network (nodes linked by distance-faded lines) with mouse repulsion and camera parallax. Fails gracefully if WebGL is unavailable.
- **GSAP-only animation system** — scroll reveals, masked word stagger, rotating role line, pinned horizontal scroll, timeline line-draw, and animated counters. Every reveal uses default-visible `fromTo` so nothing can get stuck hidden.
- **Custom cursor** — fading dot trail that morphs into a "VIEW →" badge over interactive elements (pure JS + CSS).
- **Interactive skills constellation** — an SVG node graph with hand-placed clusters, draw-on-scroll lines, and hover highlighting of connected nodes.
- **Premium composition** — glassmorphism surfaces, gradient accents, magnetic mouse-follow glow, live status bar (availability + local clock), and a consistent design-token system.
- **Accessible & responsive** — semantic HTML, `aria-label`s, full keyboard focus styles, `prefers-reduced-motion` honored everywhere, and mobile-aware layouts (horizontal scroll → vertical stack, constellation → pill list).

## Tech Stack

- **React 19** + **TypeScript** (strict)
- **Vite 8**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **GSAP 3** + ScrollTrigger + TextPlugin
- **Three.js** (hero scene only)
- Fonts: **Syne** (display), **DM Mono** (labels), **Inter** (body) via `@fontsource`

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server with HMR   |
| `npm run build`   | Type-check (`tsc -b`) + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run Oxlint                            |

## Project Structure

```
src/
  main.tsx                  # Mounts App, imports fonts, registers GSAP plugins
  App.tsx                   # Assembles sections + cursor + scroll progress
  index.css                 # Tailwind v4 import + design tokens + utilities

  components/
    CustomCursor.tsx        # Cursor dot/trail/badge
    Ticker.tsx              # Infinite CSS marquee
    ProjectCard.tsx         # Glass project card
    SkillConstellation.tsx  # SVG interactive node graph
    TimelineEntry.tsx       # Glass timeline card

  sections/
    Preloader.tsx           # Typewriter intro overlay
    Hero.tsx                # WebGL hero + masked name reveal
    About.tsx               # Bio + animated stat cards
    Work.tsx                # Pinned horizontal-scroll projects
    Skills.tsx              # Constellation (desktop) / pills (mobile)
    Experience.tsx          # Vertical timeline
    Contact.tsx             # Connected-dot canvas + CTA
    Footer.tsx              # Wordmark + nav + back-to-top

  lib/
    animations.ts           # Reusable GSAP helpers (revealUp, drawLine, counterAnim)
    hooks/
      useGSAP.ts            # gsap.context wrapper with cleanup
      useCustomCursor.ts    # Cursor trail + morph logic
      useHeroScene.ts       # Three.js connected-node network
```

## Design Tokens

Defined as CSS custom properties in `index.css`:

| Token            | Value     | Role                |
| ---------------- | --------- | ------------------- |
| `--bg`           | `#06080b` | Background          |
| `--surface`      | `#11161f` | Cards / surfaces    |
| `--accent`       | `#00e5cc` | Primary accent      |
| `--accent-2`     | `#2fffe0` | Gradient accent     |
| `--text-primary` | `#eef1f5` | Headings / body     |
| `--text-secondary`| `#aab4c4`| Secondary text      |
| `--muted`        | `#5a6478` | Labels / meta       |

## Customizing

- **Content** — edit the data arrays at the top of each section (`Work.tsx`, `Experience.tsx`) and the `ROLES` array in `Hero.tsx`.
- **Colors** — change the tokens in `:root` within `index.css`.
- **Skills graph** — adjust node coordinates/edges in `SkillConstellation.tsx`.
- **Hero scene** — tune particle count, link threshold, and repulsion in `useHeroScene.ts`.

## License

Personal portfolio. Feel free to read the code for learning, but please don't reproduce the design or content as-is.
