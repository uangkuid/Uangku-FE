# Uangku design system

[Material 3 Expressive](https://m3.material.io) components with the Uangku theme. Run the app and
open `/design-system` to see every token and component, in light and dark.

## Tokens

| Token       | Where               | Use                                              |
| ----------- | ------------------- | ------------------------------------------------ |
| Color roles | `assets/tokens.css` | `bg-primary`, `text-on-surface-variant`          |
| Type scale  | `assets/theme.css`  | `text-title-medium`, `text-label-large`          |
| Shape scale | `assets/theme.css`  | `rounded-corner-xs` … `rounded-corner-xxl`       |
| Elevation   | `assets/tokens.css` | `shadow-elevation-1` … `shadow-elevation-3`      |
| Motion      | `assets/tokens.css` | `var(--motion-fast-spatial)` in a transition     |
| State layer | `assets/main.css`   | `state-layer` (hover 8%, focus and press 10%)    |
| Interaction | `assets/main.css`   | `transition-morph`, `focus-ring`, `touch-target` |

Motion uses the expressive scheme: _spatial_ springs for size, position and shape, _effects_ springs
for color and opacity. All of them become instant under `prefers-reduced-motion`. Decorative shapes
may turn with `animate-shape-spin` (`assets/theme.css`); pair it with `motion-reduce:animate-none`.

## Components

Each component lives in a folder named after it in kebab-case, e.g.
`@/components/ui/icon-button/OraIconButton.vue`. `OraList` and `OraListItem` share `list/`. Tests go
in a `__tests__/` folder inside the component's folder, and helpers used by more than one component
go in `shared/`. Prefix a new component with `Ora`.

| Component                                 | M3 component                     | Main props                                                  |
| ----------------------------------------- | -------------------------------- | ----------------------------------------------------------- |
| `OraButton`                               | Buttons                          | `variant`, `size` xs–xl, `shape`, `selected`, `as`          |
| `OraButtonGroup`                          | Connected button group           | `options`, `selected`, `selection`, `size` s/m, `fill`      |
| `OraSplitButton`                          | Split button (filled, medium)    | `label`, `menuLabel`, `items`                               |
| `OraIconButton`                           | Icon buttons                     | `label`, `variant`, `size`, `width`, `selected`             |
| `OraFab`                                  | FAB, extended FAB                | `label`, `size`, `color`, `extended`                        |
| `OraChip`                                 | Chips (filter)                   | `selected`                                                  |
| `OraTextField`                            | Text fields (outlined)           | `label`, `error`, `supportingText`, `readonly`              |
| `OraTextArea`                             | Text fields (filled, multi-line) | `label`, `rows`                                             |
| `OraCard`                                 | Cards                            | `variant`                                                   |
| `OraList`, `OraListItem`                  | Lists (expressive, segmented)    | `as`; slots `leading`, `headline`, `supporting`, `trailing` |
| `OraSheet`                                | Side sheets (modal, detached)    | `title`, `overline`, `titleId`, `covered`                   |
| `OraSnackbar`                             | Snackbar                         | `action`; slot `icon`                                       |
| `OraNavRailItem`                          | Navigation rail                  | `label`, `icon`, `expanded`                                 |
| `OraLinearProgress`                       | Linear progress                  | `value`, `label`, `thickness`                               |
| `OraCircularProgress`                     | Circular progress                | `value`, `label`, `size`, `thickness`                       |
| `OraBadge`                                | Badges                           | `label`                                                     |
| `OraDivider`                              | Divider                          | `vertical`; text in the slot                                |
| `OraTag`                                  | — (Uangku)                       | `color`, `size`                                             |
| `OraBanner`                               | — (Uangku)                       | `tone`                                                      |
| `OraAvatar`, `CategoryIcon`, `FamilyIcon` | — (Uangku)                       |                                                             |

Components that can be a link take `as`: pass `RouterLink` with `to`, or `ComingSoonLink` for a
screen that is not built yet. Colors that a variant does not offer are set with an important
utility, e.g. `class="bg-on-primary-container!"`.

## Where Uangku differs from M3

The design canvas wins for these; everything else follows M3.

| Part            | M3 default                  | Uangku                                  |
| --------------- | --------------------------- | --------------------------------------- |
| Text field      | Floating label, 4px corners | Label above, `--radius-field` (14px)    |
| Card            | 12px corners                | `--radius-card` (32px)                  |
| Segmented list  | 16px / 4px corners, 2px gap | 24px / 6px corners, 3px gap             |
| List item text  | Body large headline         | 15px semibold headline                  |
| Button label    | Baseline weight             | Semibold                                |
| Outlined button | `on-surface-variant` label  | `primary` label                         |
| FAB             | Elevation 3, no press morph | Elevation 1, rounds fully while pressed |

The new transaction sheet also departs from its canvas where M3 decides: buttons use the M3 sizes
(the canvas draws 44px wallet chips and 48px date and picker buttons; these are 40px with a 48px
touch target), icon buttons are 40px, and the split button's menu half turns fully round while its
menu is open. The canvas wins for the filter chip (a pill that squares off when selected, with no
leading check) and the multi-line field (label inside a 24px filled container).

Not built yet, because no screen needs them: wavy progress, indeterminate progress, floating-label
text fields, dialogs, standalone menus and the other M3 components.
