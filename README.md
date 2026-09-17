# Paws & Claw — Shopify Theme

A Shopify Online Store 2.0 theme for a friendly, vet-conscious pet shop. The homepage is built from merchant-editable sections and blocks inspired by the supplied storefront direction.

## Start developing

Install the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli), authenticate to your store, then run:

```bash
shopify theme dev
```

Use `shopify theme check` before publishing and `shopify theme push` to upload a draft theme.

## Project conventions

### Global design settings

Open **Theme settings → Colors** in the Shopify editor to set the global palette. The default values are:

| Token | Default |
| --- | --- |
| Primary blue | `#087BE8` |
| Deep blue | `#0565C7` |
| Soft blue background | `#EDF7FF` |
| Card surface | `#FFFFFF` |
| Ink | `#17233A` |

Use the variables defined by `snippets/css-variables.liquid` (`--color-primary`, `--color-mist`, etc.) instead of hard-coding brand colors in a section.

### Section CSS lives in assets

Every section has its own CSS file in `assets/`, named `section-<section-name>.css`. Load it at the top of the matching Liquid file:

```liquid
{{ 'section-pet-hero.css' | asset_url | stylesheet_tag }}
```

Keep CSS rules in ordinary braces (`{ ... }`), scope them with the section component class, and avoid putting long section styles inside `{% stylesheet %}`. `assets/global.css` is only for shared tokens, buttons, layout helpers, and site-wide styles; `assets/critical.css` remains the reset and essential layout layer.

### Build with blocks first

Sections must use Shopify blocks whenever content can be repeated, reordered, or merchant-controlled. For a new section:

1. Create `sections/pet-<name>.liquid`.
2. Create `assets/section-pet-<name>.css` and load it from that section.
3. Add a block schema for each repeatable card/item, with meaningful default settings.
4. Add a preset with the minimum useful blocks so the section works immediately after it is added in the editor.
5. Add the section to the relevant JSON template only when it belongs in the default page experience.

The starter homepage includes a hero, editable benefits, category cards, featured products, testimonials, and journal cards. Product content comes from the collection selected in **Pet featured products**; it gracefully shows placeholders until a collection is selected.

## Structure

```
assets/      Global and section-scoped CSS, icons, images
blocks/      Reusable Shopify theme blocks
config/      Theme editor settings and current values
sections/    Merchant-editable page sections
snippets/    Shared Liquid helpers and CSS variables
templates/   JSON page composition
```
