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

| Component                                 | M3 component                     | Main props                                                  |
| ----------------------------------------- | -------------------------------- | ----------------------------------------------------------- |
| `AppButton`                               | Buttons                          | `variant`, `size` xs–xl, `shape`, `selected`, `as`          |
| `AppButtonGroup`                          | Connected button group           | `options`, `selected`, `selection`, `size` s/m, `fill`      |
| `AppSplitButton`                          | Split button (filled, medium)    | `label`, `menuLabel`, `items`                               |
| `AppIconButton`                           | Icon buttons                     | `label`, `variant`, `size`, `width`, `selected`             |
| `AppFab`                                  | FAB, extended FAB                | `label`, `size`, `color`, `extended`                        |
| `AppChip`                                 | Chips (filter)                   | `selected`                                                  |
| `AppTextField`                            | Text fields (outlined)           | `label`, `error`, `supportingText`, `readonly`              |
| `AppTextArea`                             | Text fields (filled, multi-line) | `label`, `rows`                                             |
| `AppCard`                                 | Cards                            | `variant`                                                   |
| `AppList`, `AppListItem`                  | Lists (expressive, segmented)    | `as`; slots `leading`, `headline`, `supporting`, `trailing` |
| `AppSheet`                                | Side sheets (modal, detached)    | `title`, `overline`, `titleId`, `covered`                   |
| `AppSnackbar`                             | Snackbar                         | `action`; slot `icon`                                       |
| `AppNavRailItem`                          | Navigation rail                  | `label`, `icon`, `expanded`                                 |
| `AppLinearProgress`                       | Linear progress                  | `value`, `label`, `thickness`                               |
| `AppCircularProgress`                     | Circular progress                | `value`, `label`, `size`, `thickness`                       |
| `AppBadge`                                | Badges                           | `label`                                                     |
| `AppDivider`                              | Divider                          | `vertical`; text in the slot                                |
| `AppTag`                                  | — (Uangku)                       | `color`, `size`                                             |
| `AppBanner`                               | — (Uangku)                       | `tone`                                                      |
| `AppAvatar`, `CategoryIcon`, `FamilyIcon` | — (Uangku)                       |                                                             |

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
