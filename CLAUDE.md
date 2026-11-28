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

Run `npx playwright install` before the first e2e run. Unit tests live in `__tests__/` folders next to the code (`*.spec.ts`): the views (`HomeView`, `LoginView`), `transaction/NewTransactionSheet`, `stores/transactionFilters` and several `ui/` components. E2E specs live in `e2e/` (`login.spec.ts`, `new-transaction.spec.ts`, `side-sheets.spec.ts`).

## Architecture

- Imports use the `@` alias for `src/` (`@/components/ui/button/OraButton.vue`).
- `src/router/index.ts`: routes are lazy-loaded views. `/` is home (not `/home`); the other screens are `/login`, `/register` and its steps (`verify-email`, `secret-key`, `emergency-kit`), `/transactions` (applied filters switch the same screen to `transaction/FilteredTransactions`), `/wallets` and `/wallets/:id` (`?tab=member`), `/report`, `/family` and its flows (`start`, `create`, `create/kit`, `join`, `join/invitation`, `join/kit`), and `/design-system`. `meta.section` marks the navigation rail item that is current.
- Side sheets and dialogs are overlays, never routes. A screen holds one `useOverlay()` (`ui/shared/useOverlay.ts`) per overlay and renders the component inside `<OraOverlay>`, which teleports it to `body`, locks page scroll and keeps it on screen for its exit animation (500 ms, the length of `--motion-default-spatial`), styled with the `sheet-leaving:` variant. A component placed in `OraOverlay` needs a single root element. While any overlay is open, `App.vue` makes the page `inert`, and a `beforeEach` guard cancels navigation and closes the top overlay (on the first history entry of a tab, Back still leaves the app). Close an overlay before navigating away from it.
- The new transaction form (`transaction/NewTransactionSheet.vue`) is the one overlay that any screen can open, with `useTransactionFormStore().open()`; `App.vue` renders it once.
- `src/stores/` holds the Pinia stores. The new transaction form offers the wallets of the `wallets` store that are awake, so its tests need an active Pinia. `overlays` tracks the open layers. `wallets`, `transactions`, `transactionFilters` and `registration` keep prototype state in memory, so a change shows on every screen until the page reloads; `navRail` keeps the rail expanded across screens.
- `src/views/`: one view per screen. A view composes feature components and gets its data from `src/data/*` or a store. Signed-in screens wrap their `main` in `layout/OraPageShell`; sign-up screens use `auth/AuthLayout`; family flows use `family/FamilyFlowLayout`.
- `src/components/` is grouped by purpose:
  - `ui/`: the design system (`OraButton`, `OraButtonGroup`, `OraSplitButton`, `OraIconButton`, `OraFab`, `OraTextField`, `OraTextArea`, `OraCard`, `OraList`, `OraSheet`, `OraSnackbar`, ...). Each component has its own kebab-case folder (`ui/button/OraButton.vue`), with its tests in a `__tests__/` folder inside it; helpers used by more than one component (`button.ts`, `radioGroup.ts`, `dismissOnOutsidePress.ts`) are in `ui/shared/`. New design system components take the `Ora` prefix, never `App`; `CategoryIcon`, `FamilyIcon` and `ComingSoonLink` predate that rule. `ui/README.md` lists every component with its main props and the departures from M3: check it before writing new UI.
  - `layout/`: app chrome (`OraNavRail`, `OraPageShell`, `OraPageHeader`).
  - `auth/`, `family/`, `home/`, `report/`, `transaction/`, `wallet/`: components for one feature each. `transaction/categories.ts` holds the category picker's logic (`CategoryChoice`, `gridChoices`).
  - `chart/` (`CumulativeChart`, used by the wallet and family screens) and `shapes/` (decorative SVG shapes).
  - `icons/`: one SVG component per icon (`IconXxx.vue`). Category icons are vector paths in `ui/category-icon/categoryIcons.ts`, drawn by `CategoryIcon`.
- `ComingSoonLink` is a placeholder for links to screens that don't exist yet. Components that can be links take `as`: pass `RouterLink` with `to`, or `ComingSoonLink`. When you add a screen's route, replace the placeholders that point to it with `RouterLink`.
- `src/data/home.ts` holds the home prototype data and the shared domain types (`Category`, `Wallet`, `Transaction`, `SpendingCategory`); `src/data/newTransaction.ts` holds the form's options and types (`TransactionType`, `CategoryOption`, `DayActivity`); `transactions.ts`, `wallets.ts`, `report.ts` and `family.ts` hold the other screens' data. Replace them with real requests once the API exists. The prototype's "today" is 5 January 2025.
- Nothing is real yet: no camera is opened, `family/MockQr` encodes nothing, secret keys are fixed strings, and "Save Secret Key" writes no file.
- `src/utils/rupiah.ts` formats money (`formatRupiah`, `formatSignedRupiah`). Use it for every amount.
- `src/utils/date.ts` holds calendar helpers. Dates are `IsoDate` strings (`YYYY-MM-DD`, local time), so they compare as text; weeks start on Monday.

## Styling

Use Tailwind utility classes only. Don't add `<style scoped>` blocks.

The design system follows Material 3 Expressive (m3.material.io). Its components are in `src/components/ui/`, and `/design-system` shows them all in light and dark. Where the design canvas and M3 disagree, component structure, button sizes, states, shape morph and motion follow M3, while the canvas's shapes stay as the Uangku theme. Record such departures in `src/components/ui/README.md`.

Its styles have three layers, all imported by `src/assets/main.css`:

1. `tokens.css` defines the color roles as CSS variables, Material 3 style (`--primary`, `--surface-container-high`, ...), for light and dark themes through `[data-theme]`, plus elevation (`shadow-elevation-1` to `-3`), state layer opacities and the motion springs (`--motion-fast-spatial`, `--motion-default-effects`, ...). Spatial springs move size, position and shape; effects springs move color and opacity. All of them become instant under `prefers-reduced-motion`.
2. `theme.css` maps those variables into Tailwind's `@theme`. That provides `bg-primary`, `text-on-surface-variant`, the type scale (`text-display-small`, `text-headline-medium`, `text-title-medium`, `text-body-large`, ...), the M3 shape scale (`rounded-corner-xs` to `rounded-corner-xxl`, plus `-lg-inc` and `-xl-inc`), component shapes (`rounded-card`, `rounded-field`, `rounded-list-outer`, `rounded-list-inner`), the `split` breakpoint (56.25rem), `animate-shape-spin` for decorative shapes (pair it with `motion-reduce:animate-none`), and the fonts (`font-sans` is Poppins, `font-display` is Montserrat).
3. `main.css` adds the `dark:` variant, which follows `data-theme='dark'` rather than the OS setting, the `sheet-leaving:` variant, and the custom utilities `state-layer` (hover, focus and press feedback), `transition-morph`, `touch-target` and `focus-ring`.

To give a component a color its variant doesn't offer, use an important utility, e.g. `class="bg-on-primary-container!"`.

Design artboards use DS class names such as `headline-medium-emphasized`. Translate them to these utilities, for example `text-headline-medium font-medium`, and avoid raw hex values.
