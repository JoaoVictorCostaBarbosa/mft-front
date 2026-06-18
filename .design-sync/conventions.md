# mft-ui Design Conventions

## Theme

All design tokens are **dark-first** — there is no light theme. The CSS variables
are declared in `:root` and assume a very dark page background. When placing any
component in a preview or design canvas, set the canvas background to
`var(--background)` (`#050607`) so text and icon colours are legible.

Key token values:
| Token | Value | Use |
|---|---|---|
| `--background` | `#050607` | Page / canvas background |
| `--foreground` | `#f8fafc` | Primary text (white) |
| `--card` | `#111827` | Card / dialog surface |
| `--primary` | `#00e5e5` | Accent / CTA (cyan) |
| `--destructive` | `#ef4444` | Danger actions |
| `--muted-foreground` | `#94a3b8` | Secondary text |
| `--border` | `#263241` | Borders / dividers |

## Component categories

### Layout (app group)
`PageContainer` and `PageHeader` are page-level shells — always used together to
build a screen. `AppLogo` is the brand mark; `ScreenHeader` is the app's top
navigation bar.

### Forms
`Input`, `Label`, `Select`, `Textarea` compose standard form fields. Pair each
input with a `Label` and wrap the pair in a dark container so the white label
text is visible against the canvas background.

### Feedback
`EmptyState`, `ErrorState`, `LoadingState` — each expects a dark background
surface. `EmptyState` accepts an optional `action` prop for a CTA button.

### Portal-based components
`Dialog`, `Select` (dropdown), and `Toast` render content through React portals.
In isolated preview contexts wrap them so the portal renders inside a dark surface.
For `Dialog` specifically: use `Dialog` (root) for context, but render the card
content directly (no `DialogContent` wrapper) when you need inline positioning.

## Fonts

This project uses **Geist Sans** (variable) and **Geist Mono** (variable). These
are loaded via Next.js's `next/font/google` setup in the app — in Claude Design
the bundle ships them via `@font-face` in the compiled CSS.

## Re-sync notes

See `.design-sync/NOTES.md` for known quirks and per-run fixes.
