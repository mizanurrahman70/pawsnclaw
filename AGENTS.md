# Paws & Claw Theme — Instructions

Shopify theme (Skeleton/Dawn architecture) for Paws & Claw, a pet supplies store.

## 1. Build every section from separated blocks

Never hardcode section copy or layout markup. Each section must be composed of
separable, reusable **blocks** that the merchant can add, remove, and reorder in the
theme editor.

- Headings, eyebrow, copy and buttons → editable `content` / `intro` blocks
- Repeatable cards (benefits, categories, reviews, journal stories) → one block type per card
- Only true data (e.g. a `collection` picker that loads products) stays a section setting
- Every section exposes a **Design controls** settings group on the `<section>` element:
  `padding_top`, `padding_bottom`, `margin_top`, `margin_bottom` (range, px) and
  `background_color` (color), rendered as an inline `style` attribute
- Every block needs `name` + `settings`; every section needs a `presets` array that lists its blocks
- Register every block instance in `templates/*.json` with `"blocks"` and `"block_order"` or the section renders empty

Reference implementation: `sections/pet-hero.liquid` (content / image / checks blocks)
and `sections/pet-benefits.liquid` (benefit blocks).

## 2. CSS in object notation

Write CSS as a `{ property: 'value' }` object, then flatten each entry to one real
CSS rule. Example:

Desired file CSS:

```css
.pet-button {
  color: 'green';
  background: 'var(--color-primary)';
  border-radius: 'var(--radius-pill)';
}
```

Equivalent object notation (used when specifying styles here):

```
{ color: 'green', background: 'var(--color-primary)', border-radius: 'var(--radius-pill)' }
```

Rules:

- Prefer the theme tokens defined in `snippets/css-variables.liquid` (`--color-*`,
  `--radius-*`, `--font-primary--*`, `--page-width`, `--page-margin`) over hardcoded values
- Keep exactly one CSS asset per section at `assets/section-<name>.css` and load it at
  the top of the section with `{{ '<name>.css' | asset_url | stylesheet_tag }}`

## 3. File layout

- `sections/*.liquid` — one section per file; schema lives inside `{% schema %} ... {% endschema %}`
- `blocks/*.liquid` — shared theme blocks (`group`, `text`)
- `snippets/css-variables.liquid` — design tokens exposed as CSS custom properties
- `templates/*.json` — page composition; keep block instances in sync here

## 4. Verify before finishing

- `{% schema %}` must be valid JSON
- `templates/*.json` must be valid JSON (their auto-generated `/* */` header is a comment; strip it for local validation)
- The `{{ 'section-*.css' | asset_url | stylesheet_tag }}` tag must reference an existing asset