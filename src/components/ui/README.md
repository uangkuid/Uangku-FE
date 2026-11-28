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

| Component                    | M3 component                        | Main props                                                          |
| ---------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| `OraButton`                  | Buttons                             | `variant`, `size` xs–xl, `shape`, `selected`, `as`                  |
| `OraButtonGroup`             | Connected button group              | `options`, `selected`, `selection`, `size` s/m, `fill`              |
| `OraSplitButton`             | Split button (filled, medium)       | `label`, `menuLabel`, `items`                                       |
| `OraIconButton`              | Icon buttons                        | `label`, `variant`, `size`, `width`, `selected`                     |
| `OraFab`                     | FAB, extended FAB                   | `label`, `size`, `color`, `extended`                                |
| `OraChip`                    | Chips (filter, assist, suggestion)  | `variant`, `selected`, `elevated`, `as`; slot `icon`                |
| `OraTextField`               | Text fields (outlined, filled)      | `variant`, `label`, `error`, `supportingText`, `readonly`           |
| `OraTextArea`                | Text fields (filled, multi-line)    | `label`, `rows`                                                     |
| `OraCard`                    | Cards                               | `variant`                                                           |
| `OraList`, `OraListItem`     | Lists (expressive, segmented)       | `as`; slots `leading`, `headline`, `supporting`, `trailing`         |
| `OraSheet`                   | Side sheets (modal, detached)       | `title`, `overline`, `titleId`, `covered`                           |
| `OraModalSheet`              | Side sheet with scrim and close     | `title`, `overline`, `closeLabel`, `covered`                        |
| `OraDialog`                  | Basic dialog                        | `title`; slots `hero`, `actions`                                    |
| `OraOverlay`                 | — (Uangku)                          | holds one `v-if` sheet or dialog                                    |
| `OraSnackbar`                | Snackbar                            | `action`; slot `icon`                                               |
| `OraSwitch`                  | Switch (with icons)                 | `v-model`, `disabled`                                               |
| `OraTabs`                    | Primary and secondary tabs          | `options`, `v-model`, `label`, `panelId`, `variant`                 |
| `OraSearchField`             | Search                              | `v-model`, `label`, `variant`                                       |
| `OraSelectMenu`              | Menu on a button                    | `label`, `options`, `selected`, `size` s/m                          |
| `OraMonthStrip`              | — (Uangku)                          | `month`, `disablePrevious`, `disableNext`                           |
| `OraBusyStatus`              | — (Uangku)                          | text in the slot                                                    |
| `OraNavRailItem`             | Navigation rail                     | `label`, `icon`, `expanded`                                         |
| `OraLinearProgress`          | Linear progress                     | `value` (none: indeterminate), `label`, `thickness`, `wavy`         |
| `OraCircularProgress`        | Circular progress                   | `value` (none: indeterminate), `label`, `size`, `wavy`              |
| `OraBadge`                   | Badges                              | `label`                                                             |
| `OraDivider`                 | Divider                             | `vertical`; text in the slot                                        |
| `OraStandardButtonGroup`     | Standard button group               | `label`, `size`; buttons in the slot                                |
| `OraFabMenu`                 | FAB menu                            | `label`, `items`; slot `icon`                                       |
| `OraInputChip`               | Chips (input)                       | `label`, `selected`; slot `leading`; emits `remove`                 |
| `OraCheckbox`                | Checkbox                            | `v-model`, `indeterminate`, `error`, `disabled`                     |
| `OraRadioButton`             | Radio button                        | `v-model`, `value`, `name`, `disabled`                              |
| `OraSlider`                  | Sliders (standard, centered, range) | `v-model` (a pair is a range), `label`, `size`, `centered`, `stops` |
| `OraDatePicker`              | Date picker (calendar)              | `v-model`, `min`, `max`, `today`                                    |
| `OraDatePickerDialog`        | Date picker (modal, modal input)    | `date`, `min`, `max`; emits `select`, `close`                       |
| `OraTimePicker`              | Time picker (dial, input)           | `v-model` (`HH:MM`), `hour12`, `mode`                               |
| `OraTimePickerDialog`        | Time picker (modal)                 | `time`, `hour12`; emits `select`, `close`                           |
| `OraMenu`                    | Vertical menu                       | `label`, `items`, `align`, `side`; slot `trigger`                   |
| `OraTooltip`                 | Tooltips (plain, rich)              | `text`, `title`, `side`; slot `actions`                             |
| `OraNavBar`, `OraNavBarItem` | Navigation bar (flexible)           | `label`; item: `label`, `icon`, `horizontal`, `badge`, `as`         |
| `OraTopAppBar`               | Top app bars (small, flexible)      | `title`, `subtitle`, `size`, `centered`, `scrolled`                 |
| `OraToolbar`                 | Toolbars (docked, floating)         | `label`, `variant`, `color`, `vertical`; slot `fab`                 |
| `OraBottomSheet`             | Bottom sheet (modal)                | `title`; slot `footer`; emits `close`                               |
| `OraFullScreenDialog`        | Full-screen dialog                  | `title`, `action`; emits `close`, `action`                          |
| `OraLoadingIndicator`        | Loading indicator                   | `label`, `size`, `contained`                                        |
| `OraCarousel`                | Carousel                            | `label`, `items`, `variant`; slot `item`                            |
| `OraTag`                     | — (Uangku)                          | `color`, `size`                                                     |
| `OraBanner`                  | — (Uangku)                          | `tone`                                                              |
| `OraAvatar`                  | — (Uangku)                          | `initials`, `size` xs/sm/md                                         |
| `CategoryIcon`, `FamilyIcon` | — (Uangku)                          | `category`; `labelled`                                              |
| `OraSleepingIcon`            | — (Uangku)                          |                                                                     |

## Overlays

Side sheets and dialogs are overlays, not routes. A screen keeps one `useOverlay()` (from
`shared/useOverlay.ts`) per overlay and puts the component in an `OraOverlay`:

```vue
<OraOverlay>
  <WalletEditSheet v-if="editing.isOpen" @close="editing.close()" />
</OraOverlay>
```

`OraOverlay` teleports to `body`, locks page scroll and runs the exit animation. While any overlay
is open, `App.vue` makes the page inert and Back closes the top one. A component placed in
`OraOverlay` must have a single root element, or the transition cannot animate it: nest a dialog's
`OraOverlay` inside the sheet, not beside it.

`OraBottomSheet`, `OraFullScreenDialog`, `OraDatePickerDialog` and `OraTimePickerDialog` go in an
`OraOverlay` too. Their Escape and focus handling is `shared/useModalFocus.ts`.

Components that can be a link take `as`: pass `RouterLink` with `to`, or `ComingSoonLink` for a
screen that is not built yet. Colors that a variant does not offer are set with an important
utility, e.g. `class="bg-on-primary-container!"`.

## Where Uangku differs from M3

The design canvas wins for these; everything else follows M3.

| Part                | M3 default                  | Uangku                                              |
| ------------------- | --------------------------- | --------------------------------------------------- |
| Text field          | Floating label, 4px corners | Label above, `--radius-field` (14px)                |
| Card                | 12px corners                | `--radius-card` (32px)                              |
| Segmented list      | 16px / 4px corners, 2px gap | 24px / 6px corners, 3px gap                         |
| List item text      | Body large headline         | 15px semibold headline                              |
| Button label        | Baseline weight             | Semibold                                            |
| Outlined button     | `on-surface-variant` label  | `primary` label                                     |
| FAB                 | Elevation 3, no press morph | Elevation 1, rounds fully while pressed             |
| Floating text field | 4px corners                 | `--radius-field`; the label above stays the default |
| Picker selection    | Circle                      | `--radius-field` square on days and years           |
| Menu                | Elevation 2, 16px corners   | 20px corners, 14px item corners                     |

The new transaction sheet also departs from its canvas where M3 decides: buttons use the M3 sizes
(the canvas draws 44px wallet chips and 48px date and picker buttons; these are 40px with a 48px
touch target), icon buttons are 40px, and the split button's menu half turns fully round while its
menu is open. The canvas wins for the filter chip (a pill that squares off when selected, with no
leading check) and the multi-line field (label inside a 24px filled container).

The other screens follow the same rule: M3 button and icon button sizes replace the canvas's odd
heights (36px to 48px buttons become 40px with a 48px touch target), the filter badge keeps the
canvas's primary color, side sheets share one 480px width and a 32% scrim, and the sleep and wake
dialogs use the dialog component's own motion.

The components that no screen uses yet follow M3, with these simplifications: carousel items keep
their size while scrolling; the wavy indicators and the loading indicator approximate the M3 shapes
and springs; the standard button group widens the pressed button without squeezing its neighbours;
and the top app bar collapses when the caller sets `scrolled`, not along with the scroll.

## Not covered

M3 Expressive replaces the segmented buttons, the navigation drawer and the bottom app bar with the
connected button group, the expanded navigation rail and the docked toolbar, so they are not built.
Also missing: the search view, the date range picker as a component (`transaction/DateRangeFilter`
has one for the filters), submenus, the standard (non-modal) bottom and side sheets, and the other
colors and sizes of the split button.
