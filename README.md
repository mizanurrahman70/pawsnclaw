# Paws & Claw Theme

A Shopify theme for **Paws & Claw**, a pet supplies store. Built on the Skeleton/Dawn
architecture, where every section is composed of separable, reusable blocks that the
merchant can add, remove, and reorder in the theme editor.

## Getting started

1. Clone the repository and open it with the [Shopify CLI](https://shopify.dev/docs/shopify-cli).
2. Connect it to your store:

   ```bash
   shopify theme dev
   ```

   or push it directly:

   ```bash
   shopify theme push
   ```

3. Open the theme editor (`/admin/themes` → *Customize*) to compose pages from blocks.

## Docker

The repository includes a `Dockerfile` (Node + Shopify CLI), a `docker-compose.yml`,
and a `.dockerignore`. The image has two stages: `checker` runs the local validation
(`shopify theme check`), and the final stage runs the theme dev server.

```bash
# Validate the theme (no store connection needed)
docker build --target checker -t pawsnclaw-theme-check .

# Run the dev server against your store
docker compose up --build
```

Authentication uses a **Theme Access token** (non-interactive) or the CLI's interactive
login flow. Set these environment variables in a `.env` file next to `docker-compose.yml`:

```bash
SHOPIFY_STORE=your-store.myshopify.com
SHOPIFY_CLI_THEME_TOKEN=shpat_xxxx
```

Then open http://localhost:9292 and the theme editor / preview links printed by the CLI.

## Theme structure

```
sections/*.liquid          One section per file; the {% schema %} lives in the same file
blocks/*.liquid            Shared theme blocks (group, text)
snippets/*.liquid          Reusable render snippets (facets, style controls, design tokens)
templates/*.json           Page composition; block instances are registered here
assets/section-<name>.css  Exactly one stylesheet per section, loaded at the top of the section
assets/section-<name>.js   Section script (optional)
layout/*.liquid            Theme layout(s)
config/*.liquid / *.json   Theme settings (settings_schema, settings_data)
```

This is predominantly a *section-first* theme: most of the homepage is built from
`pet-*` sections (hero, benefits, categories, featured products, testimonials,
journal, newsletter, and more).

## Key files

| File | Purpose |
| --- | --- |
| `sections/pet-hero.liquid` | Reference section: content / image / checks blocks |
| `sections/pet-benefits.liquid` | Reference section: `benefit` blocks |
| `sections/collection.liquid` | Collection page with product grid + faceted filters |
| `sections/search.liquid` | Search results page with faceted filters |
| `snippets/pet-facets.liquid` | Shopify native facets renderer (filters, sort, active pills) |
| `snippets/pet-facets-pagination.liquid` | No-JS pagination links that preserve active filter params |
| `assets/pet-facets.js` | Progressive enhancement: auto-submit filters on change |
| `snippets/css-variables.liquid` | Design tokens exposed as CSS custom properties |
| `snippets/style-controls.liquid` | Section design-control renderer (padding, margins, background) |
| `snippets/block-style-controls.liquid` | Block design-control renderer (colors, background) |

## Design tokens

`assets/global.css` and `snippets/css-variables.liquid` expose design tokens as CSS
custom properties. **Prefer these over hardcoded values:**

```
--color-*             Background, foreground, primary, surface, mist, success
--radius-*            Pill / card corner radii
--font-primary--*     Typeface family, weight, style
--page-width          Max content width
--page-margin         Outer gutter
```

## Building sections

The pattern used across this theme is: **never hardcode section copy or layout markup.**
Every section is composed of blocks.

1. **Headings, eyebrow, copy and buttons** → editable `content` / `intro` blocks.
2. **Repeatable cards** (benefits, categories, reviews, journal stories) → one block
   type per card.
3. **Only true data** (e.g. a `collection` picker that loads products) stays a section setting.
4. Every section exposes a **Design controls** group on the `<section>` element:
   `padding_top`, `padding_bottom`, `margin_top`, `margin_bottom` (ranges, px) and
   `background_color`, rendered as an inline `style` attribute.
5. Every block needs `name` + `settings`; every section needs a `presets` array.
6. **Register every block instance in `templates/*.json`** with `"blocks"` and
   `"block_order"`, or the section renders empty.

See `sections/pet-hero.liquid` and `sections/pet-benefits.liquid` for reference
implementations.

### CSS in object notation

When specifying styles here (or in issues), write CSS as a `{ property: 'value' }`
object that flattens to real CSS rules. Example:

```css
.pet-button {
  color: 'green';
  background: 'var(--color-primary)';
  border-radius: 'var(--radius-pill)';
}
```

Equivalent object notation:

```
{ color: 'green', background: 'var(--color-primary)', border-radius: 'var(--radius-pill)' }
```

Keep exactly **one CSS asset per section** at `assets/section-<name>.css` and load it
at the top of the section:

```liquid
{{ '<name>.css' | asset_url | stylesheet_tag }}
```

## Filters & search (collection / search pages)

Filtering uses **Shopify native facets** and works with JavaScript **disabled**:

- `{% render 'pet-facets' %}` outputs a plain `<form method="get">`. Checking a
  filter, picking a sort, and clicking **Apply filters** submits one GET request
  carrying all `filter.*`, `sort_by`, and `q` params.
- `snippets/pet-facets-pagination.liquid` builds pagination links in Liquid that
  preserve the active filter + sort params.
- `assets/pet-facets.js` is an optional enhancement only — with JS available,
  filter/price changes auto-submit without pressing **Apply**.

In the theme editor, the `filters` block on the **Collection** section exposes:

- **Show / off** toggles for collection info and filters.
- **Filter position** — left sidebar or top bar (two-column group grid).
- **Options layout** — vertical list or horizontal pill chips.

## Verifying before shipping

- `{% schema %}` blocks must be valid JSON.
- `templates/*.json` must be valid JSON. Their auto-generated `/* */` header is a
  comment — strip it for local validation:

  ```bash
  node -e "const fs=require('fs');for(const f of fs.readdirSync('templates').filter(x=>x.endsWith('.json'))){JSON.parse(fs.readFileSync('templates/'+f,'utf8').replace(/\/\*[\s\S]*?\*\//,''))}"
  ```

- The `{{ 'section-*.css' | asset_url | stylesheet_tag }}` tag must reference an
  existing asset.