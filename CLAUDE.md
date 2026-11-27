# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Uangku-FE is the web frontend for Uangku, a personal and family finance app (wallets, transactions, reports, Rupiah amounts). Stack: Vue 3 (`<script setup lang="ts">`), Vite, Vue Router, Pinia, Tailwind CSS v4. Screens are built one at a time from a design canvas. There is no backend API yet, so screens read prototype data from `src/data/`.

## Environment

The repo lives in the WSL distro `ubuntu-24.04`, and `bun` is only installed inside WSL. The WSL login shell is fish, which mangles `$` in inline `bash -lic '...'` commands. To run tooling from Windows, write a bash script to the scratchpad and run it with `wsl.exe -d ubuntu-24.04 -- bash -lic 'bash /mnt/c/.../script.sh'`. Run git inside WSL too.

`typescript` is overridden with `typescript-native-bridge` (see `package.json` `overrides`). In VS Code, select the workspace TypeScript version.

## Commands

```sh
bun install
bun dev                      # Vite dev server on :5173, listens on IPv4 and IPv6 so Windows can reach WSL
bun run build                # vue-tsc type-check and vite build, run in parallel
bun run type-check           # vue-tsc --build only
bun test:unit                # Vitest (jsdom) in watch mode
bun x vitest run src/views/__tests__/LoginView.spec.ts   # one unit test file, single run
bun x vitest run -t "requires a well-formed email"        # tests matching a name
bun test:e2e                 # Playwright; starts or reuses the dev server
bun test:e2e --project=chromium e2e/login.spec.ts         # one browser, one file
bun run lint                 # oxlint then eslint, both with --fix, over the whole repo
bun x oxlint . && bun x eslint .                          # lint without changing files
bun run format               # Prettier on src/ (no semicolons, single quotes, width 100)
```

Run `npx playwright install` before the first e2e run. Unit tests live in `__tests__/` folders next to the code (`*.spec.ts`). E2E specs live in `e2e/`.

## Architecture

- `src/router/index.ts`: routes are lazy-loaded views. Home is at `/`, not `/home`. Login is at `/login`. A sheet over a page, such as `/transactions/new`, is a route with a named `sheet` view and `meta.sheet`, which makes the page behind it inert. `App.vue` keeps a leaving sheet on screen for its exit animation, styled with the `sheet-leaving:` variant.
- `src/views/`: one view per screen. A view composes feature components and gets its data from `src/data/*`.
- `src/components/` is grouped by purpose:
  - `ui/`: the design system (`AppButton`, `AppIconButton`, `AppTextField`, `AppCard`, `AppList`, ...). Check `ui/README.md` before writing new UI.
  - `layout/`: app chrome such as `AppNavRail`.
  - `auth/`, `home/`, `transaction/`: components for one screen each.
  - `icons/`: one SVG component per icon (`IconXxx.vue`).
- `ComingSoonLink` is a placeholder for links to screens that don't exist yet. When you add a screen's route, replace the placeholders that point to it with `RouterLink`.
- `src/data/home.ts` holds the prototype data and the shared domain types (`Category`, `Wallet`, `Transaction`); `src/data/newTransaction.ts` holds the form's options. Replace them with real requests once the API exists.
- `src/utils/rupiah.ts` formats money (`formatRupiah`, `formatSignedRupiah`). Use it for every amount.

## Styling

Use Tailwind utility classes only. Don't add `<style scoped>` blocks.

The design system follows Material 3 Expressive (m3.material.io). Its components are in `src/components/ui/`, and `/design-system` shows them all in light and dark. Where the design canvas and M3 disagree, component structure, button sizes, states, shape morph and motion follow M3, while the canvas's shapes stay as the Uangku theme. Record such departures in `src/components/ui/README.md`.

Its styles have three layers, all imported by `src/assets/main.css`:

1. `tokens.css` defines the color roles as CSS variables, Material 3 style (`--primary`, `--surface-container-high`, ...), for light and dark themes through `[data-theme]`, plus elevation, state layer opacities and the motion springs (`--motion-fast-spatial`, `--motion-default-effects`, ...).
2. `theme.css` maps those variables into Tailwind's `@theme`. That provides `bg-primary`, `text-on-surface-variant`, the type scale (`text-display-small`, `text-headline-medium`, `text-title-medium`, `text-body-large`, ...), the M3 shape scale (`rounded-corner-xs` to `rounded-corner-xxl`), component shapes (`rounded-card`, `rounded-field`), the `split` breakpoint, and the fonts (`font-sans` is Poppins, `font-display` is Montserrat).
3. `main.css` adds the `dark:` variant, which follows `data-theme='dark'` rather than the OS setting, plus the custom utilities `state-layer` (hover, focus and press feedback), `transition-morph`, `touch-target` and `focus-ring`.

Design artboards use DS class names such as `headline-medium-emphasized`. Translate them to these utilities, for example `text-headline-medium font-medium`, and avoid raw hex values.
