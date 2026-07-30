# Malik Ltd — Design System

## Brand Identity

**Brand Name:** Malik Ltd
**Tagline:** AI Developer Platform
**Design Philosophy:** Minimal, monochrome, functional. No decoration without purpose.

---

## Color System

Strict black & white monochrome. No exceptions.

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#000000` | Page backgrounds |
| `--bg-surface` | `rgba(255,255,255,0.04)` | Card/panel surfaces |
| `--bg-elevated` | `rgba(255,255,255,0.06)` | Dropdowns, modals |
| `--bg-input` | `rgba(255,255,255,0.08)` | Input fields |
| `--border-subtle` | `rgba(255,255,255,0.04)` | Lightest borders |
| `--border-medium` | `rgba(255,255,255,0.08)` | Standard borders |
| `--text-heading` | `#ffffff` | Primary headings |
| `--text-body` | `rgba(255,255,255,0.80)` | Body text |
| `--text-dim` | `rgba(255,255,255,0.50)` | Secondary text |
| `--text-faint` | `rgba(255,255,255,0.25)` | Placeholder, disabled |

### Button Variants

- **Primary:** bg-white/10 → hover:bg-white/20, text-white
- **Ghost:** bg-transparent → hover:bg-white/5, text-white/70
- **Danger:** bg-white/10 → hover:bg-white/20, text-white (with red icon)

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| App title | `Geist Mono, monospace` | 11px | 500 |
| Page heading | `Inter, sans-serif` | 13px | 600 |
| Section title | `Inter, sans-serif` | 11px | 500 |
| Body | `Inter, sans-serif` | 11px | 400 |
| Code/inline | `Geist Mono, monospace` | 10px | 400 |
| Labels | `Inter, sans-serif` | 9px | 500 |
| Tiny/meta | `Inter, sans-serif` | 9px | 400 |

Scale: 9px → 10px → 11px → 13px (no large headings)

---

## Spacing

Compact. Reduce everything by ~30% from standard.

| Token | Value |
|-------|-------|
| Page padding | `p-2` (8px) |
| Card padding | `p-2.5` (10px) |
| Gap (sections) | `gap-2` (8px) |
| Gap (items) | `gap-1.5` (6px) |
| Stack margin | `mb-2` (8px) |
| Icon size | `w-3 h-3` (12px) |
| Border radius | `rounded` (4px) |

---

## Components

### Sidebar
- Fixed left, 48px collapsed / 180px expanded
- Tab items: 9px font, uppercase, tracking-wider
- Active tab: bg-white/10 indicator
- Bottom: logout button

### Cards
- bg-white/[0.02] background
- border-white/5 border
- p-2.5 padding
- No shadows, no gradients

### Buttons
- 24-28px height
- 10px font, medium weight
- Rounded (4px)
- Icon + text layout

### Chips/Tags
- bg-white/5 background
- 9px font
- Rounded-full (8px)
- No colored variants

### Progress Bar
- h-1, bg-white/10 track
- bg-white/50 fill
- Rounded

### Tooltips
- bg-white/10 background
- 9px font
- px-2 py-1 padding

---

## Layout

- Full viewport height/width
- Fixed sidebar (left)
- Scrollable main content
- Back button on every sub-page
- ErrorBoundary wraps each route
- Persistent iframes (Coder/AI Agents) — CSS hidden, not unmounted

---

## Motion

- Duration: 0.15s–0.2s (fast)
- Easing: ease-out
- Only animation: `animate-spin` for loading states
- No pulse, bounce, glow, or colored animation effects

---

## Accessibility

- WCAG AA contrast ratios (text: 4.5:1 minimum)
- Focus-visible ring on interactive elements
- `select-none` on body for desktop UI
- Semantic HTML structure
- Tab-accessible navigation

---

## Iconography

Using [Lucide React](https://lucide.dev/) icons exclusively.
Icon size standard: 12px (w-3 h-3).
Small icons: 10px (w-2.5 h-2.5).
Large icons: 14px (w-3.5 h-3.5).

---

## File Organization

```
src/
├── [feature]/        # One folder per page/feature
├── layout/            # Sidebar, app shell
├── auth/              # Login + 2FA
├── theme/             # ThemeContext
├── utils/             # Shared utilities
├── server/            # Backend only
└── types.ts           # Global types
```
