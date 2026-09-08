# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Buyers and collectors who discover Constanza Bellomo's work (via Instagram or word of mouth) and browse the site to view available paintings and decide whether to inquire about purchasing one.

## Product Purpose

A personal catalog site for painter Constanza Bellomo. It presents her paintings — image, title, description, technique, and dimensions — so a visitor can evaluate a piece and reach out to buy it. Success is a visitor finding a piece they want and contacting the artist.

## Positioning

Not a marketplace or gallery aggregator: a single artist's own catalog, presented as her personal body of work rather than inventory in a store.

## Operating Context

Static site (React/Vite/Tailwind), deployed on Vercel. No backend, database, or CMS — paintings are hardcoded in `src/data/obras.js`. Inquiries and purchases happen entirely off-site via Instagram DM or WhatsApp; sold pieces are marked unavailable ("Vendido") but stay visible in the catalog.

## Capabilities and Constraints

- No online checkout or payment — purchase inquiries route to WhatsApp/Instagram only, and this must not change.
- No CMS/admin UI — adding or editing a painting means editing `obras.js` and adding an image.
- Each painting has: title, description, technique, dimensions, and availability status.

## Brand Commitments

- Artist name: Constanza Bellomo, credited as "Visual Artist."
- Instagram: @constanzabellomo (linked from header and footer).
- WhatsApp contact for inquiries (footer).

## Evidence on Hand

Design reference (visual, not product truth): https://www.1808vision.com/es — a comparable single-artist catalog/portfolio site. Minimal white-background layout, generous whitespace, uniform gallery-grid thumbnails, restrained sans-serif type, and artwork itself carrying the color — no competing visual noise. Noted here as evidence for future visual-world work (`/impeccable new-work` or `document`), not applied yet.

## Product Principles

- Keep it minimal and quiet — gallery-like, not busy, salesy, or heavily branded.
- The work is the content: let paintings and their images carry the page, not decoration or marketing copy.
- Never introduce a cart, checkout, or pricing UI — purchase intent is handled by the artist personally, off-site.
- Preserve every painting's real image, title, and description; never invent or alter artwork details.
