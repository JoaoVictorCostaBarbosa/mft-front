# mft-front design-sync notes

## Repo shape

- Next.js 15 app (not a library) — no compiled `dist/`, no `.d.ts` exports
- Tailwind CSS **v4** (`@import "tailwindcss"` in `globals.css`) — requires `@tailwindcss/node` compile API; no Tailwind CLI available
- Radix UI primitives + CVA (class-variance-authority) for variant management
- Shape: `package` (no Storybook)

## Entry file

`mft-entry.mjs` at the **project root** (not inside `.ds-sync/`). Must stay at
root because the converter walks up from the entry file to find `package.json`.
`.ds-sync/package.json` (created for converter deps) would intercept the walk if
the entry lived inside `.ds-sync/`.

Re-export paths use `./src/` (relative to project root), not `../src/`.

## Excluded components (Next.js router)

`BottomNav`, `AppBottomNav`, `AppScreen` use `next/link` and `usePathname` from
`next/navigation`. esbuild bundles `process.env.__NEXT_*` and `process.nextTick`
references that fail at runtime in a non-Next.js context. Keep them out of
`mft-entry.mjs` and `componentSrcMap`.

## CSS generation

`.ds-sync/gen-css.mjs` generates Tailwind v4 CSS using `@tailwindcss/node`'s
`compile()` API. It scans all `.tsx/.ts/.jsx/.js` files in `src/` for class
candidates via regex and outputs `.ds-sync/generated.css`. The `cssEntry` field
in `config.json` points to this generated file.

## componentSrcMap required

No compiled `.d.ts` files exist in this Next.js app, so the converter's
`exportedNames()` returns an empty set. The `componentSrcMap` in `config.json`
is required — it explicitly lists all 20 synced components.

## Preview quirks

### Portal-based components (Dialog)
`DialogContent` in this project hard-wraps in `DialogPortal` which renders at
`document.body`. Screenshots are synchronous so `useEffect`-based container refs
don't work. Solution: use `Dialog` (root) for context only and render the card
layout as a plain `<div className="...">` child — no `DialogContent` or portal.

### Dark background wrappers needed for
Any component that uses `text-foreground` (= `#f8fafc` white) on a transparent
background will be invisible on the white review-sheet background. Always wrap:
- `AppLogo`, `PageHeader`, `PageContainer` — page-level components, white text
- `EmptyState` — title is `text-foreground`
- `Ghost` Button variant — white text
- `Label` + Input/Select combinations — label is white text
- `Dialog` — card text is `text-foreground`

### Select dropdown (SelectContent)
`SelectContent` also renders via a Radix portal. Don't try to show the open
dropdown in previews — just show the trigger in closed state.

### Toast
`ToastViewport` positions via fixed CSS. Wrap in `<div style="position:relative; height:100px">` and `ToastProvider` to contain it.

## Build commands (run from project root)

```bash
# Full rebuild (bundle + previews)
node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --out ./ds-bundle

# Preview-only rebuild (faster, for fixing preview files)
node .ds-sync/lib/preview-rebuild.mjs --config .design-sync/config.json --node-modules ./node_modules --out ./ds-bundle --components Button,Badge,...

# Screenshot capture
node .ds-sync/package-capture.mjs --out ./ds-bundle --components Button,Badge,...

# CSS regeneration
node .ds-sync/gen-css.mjs
```
