---
name: Constanza Bellomo — Catálogo
description: A quiet, gallery-like painting catalog where the artwork carries every color.
colors:
  canvas: "#FAFAF8"
  carbon: "#1C1C1A"
  card-surface: "#F9FAFB"
  hairline: "#F3F4F6"
  fine-print: "#D1D5DB"
  muted-label: "#9CA3AF"
  meta-text: "#6B7280"
  hover-ink: "#1F2937"
  active-ink: "#111827"
  sold-red: "#991B1B"
typography:
  headline:
    fontFamily: "\"Playfair Display\", Georgia, serif"
    fontSize: "clamp(1.875rem, 5vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.02em"
  title:
    fontFamily: "\"Playfair Display\", Georgia, serif"
    fontSize: "clamp(0.875rem, 1vw, 1rem)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.02em"
  detailHeadline:
    fontFamily: "\"Playfair Display\", Georgia, serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 500
    letterSpacing: "0.18em"
rounded:
  none: "0px"
  sm: "2px"
  full: "9999px"
spacing:
  card-gap: "20px"
  card-gap-md: "24px"
  section-y: "32px"
  section-y-md: "48px"
  container-x-sm: "16px"
  container-x-md: "32px"
  container-x-lg: "64px"
components:
  button-primary:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.none}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.hover-ink}"
  button-primary-active:
    backgroundColor: "{colors.active-ink}"
  button-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.muted-label}"
    rounded: "{rounded.none}"
  badge-sold:
    backgroundColor: "{colors.sold-red}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  gallery-card:
    backgroundColor: "{colors.card-surface}"
    rounded: "{rounded.sm}"
---

# Design System: Constanza Bellomo — Catálogo

## Overview

**Creative North Star: "The Quiet Gallery"**

This is a system built to disappear. It behaves like museum wall text next to a painting: present, legible, structurally confident, and never louder than the work it labels. Everything neutral — the warm paper canvas, the near-black carbon ink, the barely-there shadows, the near-square corners — exists to let each painting's own color be the only saturated thing on the screen. The one deliberate exception is a single red-800 "Vendido" mark, used exclusively as a status signal, never as decoration.

The type system reinforces the same restraint: a serif (Playfair Display) is reserved for names and titles — the artist's identity and the paintings' identity — while everything functional (labels, meta, buttons, navigation) runs in a plain, uppercase-tracked sans (Inter). That split is the system's clearest tell: serif means "this is a proper noun," sans means "this is an instruction or a fact."

**Key Characteristics:**
- Warm neutral palette (off-white paper, near-black ink) with zero brand color — art supplies all saturation
- Serif reserved strictly for names/titles; sans for everything else, often uppercase and letter-spaced
- Nearly flat: a whisper-soft shadow and a hairline ring are the only depth cues
- Square-cornered by default (buttons, badges have zero radius); `rounded-sm` (2px) softens only image containers, never fully rounds them
- One reserved status color (deep red) exists solely to mark a painting sold — never reused decoratively

## Colors

Warm and deliberately quiet: paper-and-ink neutrals dominate so nothing competes with the paintings' own palette.

### Primary
- **Carbon** (`#1C1C1A`): the system's only "ink." Headlines, body text, primary button background, active dot indicators. Reads as near-black, not pure black — softer, warmer.

### Secondary
- **Sold Red** (`#991B1B`): reserved exclusively for the "Vendido" (sold) ribbon and pill badge. Never used for links, buttons, or any other UI state — its rarity is what makes it legible as a status marker rather than a brand accent.

### Neutral
- **Canvas** (`#FAFAF8`): the page background and primary CTA text color — warm off-white, like paper rather than screen-white.
- **Card Surface** (`#F9FAFB`): background behind gallery thumbnails and the modal's image panel, a half-step cooler than canvas so images have a quiet backdrop.
- **Hairline** (`#F3F4F6`): dividers (header/footer borders, modal footer border) and the disabled-button fill.
- **Fine Print** (`#D1D5DB`): the smallest, lowest-emphasis text (footer copyright).
- **Muted Label** (`#9CA3AF`): the tagline under the artist's name, dt-labels ("Técnica", "Medidas"), disabled-button text.
- **Meta Text** (`#6B7280`): supporting body copy color for description/detail text at rest.
- **Hover Ink** (`#1F2937`) / **Active Ink** (`#111827`): the primary button's hover and pressed states — the same near-black family, stepped one and two shades darker.

### Named Rules
**The One Saturated Color Rule.** Across the entire interface, red-800 is the only non-neutral color, and it appears only on the "Vendido" marker. No other status, link, or accent color exists — if something needs emphasis, it gets weight or size, not color.

## Typography

**Display/Title Font:** Playfair Display (with Georgia, serif fallback)
**Body/Label Font:** Inter (with system-ui, sans-serif fallback)

**Character:** A classic, editorial serif for anything that names a person or a piece of art, paired with a restrained, evenly-tracked sans for everything functional. The pairing reads as gallery signage: elegant proper nouns, plain-spoken instructions.

### Hierarchy
- **Headline** (400, `clamp(1.875rem, 5vw, 3rem)`, line-height 1.1, letter-spacing 0.02em): the artist's name in the site header — the only page-level display moment.
- **Detail Headline** (400, `clamp(1.5rem, 3vw, 1.875rem)`, line-height 1.2): a painting's title inside the detail/lightbox view.
- **Title** (400, `clamp(0.875rem, 1vw, 1rem)`, line-height 1.3, letter-spacing 0.02em): a painting's title as a gallery-grid caption. Deliberately sized *smaller on desktop than on mobile* — it's a caption there, not a headline.
- **Body** (400, 0.875rem/14px, line-height 1.6, color meta-text): painting descriptions and detail copy. No stated max-width constraint currently, but keep close to 60–75ch if body copy grows.
- **Label** (500, 0.625rem–0.75rem, letter-spacing 0.18em, uppercase): dt-labels ("Técnica", "Medidas", "Descripción"), the "Visual Artist" tagline, footer/nav micro-links, and the "Vendido" badge text.

### Named Rules
**The Proper-Noun Serif Rule.** Playfair Display appears only where something is being named — the artist, a painting title. It never appears in labels, buttons, or body copy; Inter owns all of that.

## Layout

Mobile-first, generously padded, no hard-centered max-width container — the grid simply grows its horizontal padding at each breakpoint (16px → 32px → 64px) rather than capping content width. Vertical rhythm is generous: 32px section padding on mobile, stepping to 48px on desktop.

The gallery is a responsive grid: 2 columns on mobile, 3 at `sm`, 4 at `lg`, with a 20px gap that opens to 24px at `md`. The detail/lightbox view splits into a 62% image / 38% info two-panel layout on desktop (`md:flex`), collapsing to a full-bleed stacked view with a sticky bottom CTA on mobile — the info panel's action button stays reachable while photos and description scroll underneath it.

## Elevation & Depth

Nearly flat. The system does not build a layered elevation scale; it uses one soft, consistent lift for anything that sits "above" the page (gallery cards, floating modal controls) and a heavier, singular shadow for the one true overlay (the lightbox modal itself). There is no hover-elevation choreography beyond image scale and color shifts — shadows are static, not state-driven.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 2px 14px rgba(0,0,0,0.10)` + `ring-1 ring-black/[0.06]`): every gallery thumbnail. A soft ambient shadow plus a near-invisible hairline ring — reads as a print resting on a wall, not a UI card floating above a surface.
- **Floating control** (`shadow` utility, on `bg-white/90 backdrop-blur-sm`): the modal's close/prev/next buttons — enough lift to separate a translucent control from whatever image is behind it.
- **Overlay** (`shadow-2xl`, on the modal panel; `bg-black/70 backdrop-blur-sm` on the scrim): the one deliberately heavy shadow in the system, reserved for the single full-screen overlay moment.

### Named Rules
**The Whisper-Lift Rule.** Elevation exists to separate artwork from background, never to add visual drama. If a shadow is noticeable before the content it's lifting, it's too heavy for this system.

## Shapes

Square by default, softened only where an image needs to feel contained rather than cut off. Buttons, badges, and the "Vendido" pill carry zero border-radius — deliberately blunt, almost like a printed label. Gallery thumbnails and the modal panel use `rounded-sm` (2px), just enough to remove a hard edge without reading as "rounded UI." Full-round (`rounded-full`) is reserved for the tiniest elements only — the mobile lightbox's dot-pagination indicators.

## Components

### Buttons
- **Shape:** square corners, 0px radius, always.
- **Primary:** carbon background, canvas text, `Consultar por WhatsApp` — full-width, 16px vertical / 24px horizontal padding, uppercase-free but letter-spaced (`tracking-wide`).
- **Hover / Focus:** background steps to Hover Ink (#1F2937); pressed steps to Active Ink (#111827). Transition is a plain 150ms color fade — no scale, no shadow change.
- **Disabled (sold-out state):** hairline background, muted-label text, `cursor-default`, no hover treatment — visually inert on purpose, so it reads as unavailable rather than clickable-but-broken.

### Badge (Sold)
- **Ribbon variant** (gallery card): a diagonal 45°-rotated red-800 strip pinned to the card's top-right corner, white uppercase micro-type — a physical "sold sticker" gesture.
- **Pill variant** (detail view): the same red-800/white/uppercase treatment as an inline `px-3 py-1` pill with a small checkmark icon, sitting beside the painting title.
- **Rule:** this red never appears anywhere else in the system — not as a link color, not as an error state, not as an accent.

### Cards (Gallery Thumbnail)
- **Corner Style:** `rounded-sm` (2px).
- **Background:** Card Surface (#F9FAFB), visible as letterboxing behind non-4:5 images.
- **Shadow Strategy:** Card Lift (see Elevation).
- **Interaction:** image scales to 1.04 on hover/focus over a 300ms ease-out; unavailable (sold) works render at 88% brightness so the ribbon reads as a real status change, not just a label.
- **Caption:** serif Title directly beneath the image, no card border or background block — the caption floats on the page background, not inside a card shell.

### Modal / Lightbox
- **Scrim:** `bg-black/70` with `backdrop-blur-sm`, closes on click-outside.
- **Panel:** canvas background, `rounded-sm`, `shadow-2xl`; full-screen on mobile, capped at `max-w-4xl` / `92vh` on desktop.
- **Navigation:** floating translucent (white/90, backdrop-blur) circular-feeling icon buttons for close/prev/next; swipe-to-navigate on touch (50px threshold); dot indicators on mobile only.
- **Info panel:** label/value pairs (`dl`) in uppercase Label + carbon Body text; the CTA is sticky to the viewport bottom on mobile so it never scrolls out of reach.

### Navigation (Header/Footer)
- **Header:** centered, serif artist name (Headline) over an uppercase Label tagline ("Visual Artist"), a single Instagram link below, separated from the page by a hairline bottom border.
- **Footer:** centered row of uppercase Label links (Instagram, WhatsApp) separated by a plain `|` glyph, with Fine Print copyright text beneath. Both use the same muted-label-to-carbon hover fade as the header link.

## Do's and Don'ts

### Do:
- **Do** keep every saturated color confined to the artwork photography itself — the interface stays neutral.
- **Do** use red-800 exclusively for the "Vendido" (sold) marker, in either its ribbon or pill form.
- **Do** keep buttons and badges at 0px radius while image containers and the modal stay at `rounded-sm` (2px) — the contrast between "sharp label" and "softened image" is intentional.
- **Do** reserve Playfair Display for names and titles only; everything else stays in Inter.
- **Do** keep shadows soft and static (Card Lift / Floating Control / Overlay) — no hover-elevation animation beyond image scale and color transitions.

### Don't:
- **Don't** introduce a second accent or brand color — the palette is deliberately down to near-black, near-white, and one reserved status red.
- **Don't** round buttons, badges, or pills — squared corners are load-bearing for the system's "printed label" feel.
- **Don't** add drop shadows heavier than the modal's `shadow-2xl` — that's the system's ceiling, reserved for the one true full-screen overlay.
- **Don't** add marketing chrome (banners, promotional badges, upsell CTAs) — the only call to action anywhere in the system is a single WhatsApp inquiry link per painting.
