# Sergio & Merilyn — Bricks Builder Section Templates

All templates live in this folder. Import each one into WordPress Bricks Builder
via **Bricks → Templates → Import**.

---

## Section Templates (11 total)

| File | Section | Notes |
|---|---|---|
| `template-sm-hero-section.json` | Hero / portada | Background image · Names · Date · Location |
| `template-sm-verso-biblico-section.json` | Bible verse | Filipenses 1:9 · Gold dividers |
| `template-sm-cuenta-regresiva-section.json` | Countdown | Uses Bricks countdown element → Nov 7, 2026 14:30 |
| `template-sm-nos-casamos-section.json` | Historia + Padres | Portrait photo · Parents gratitude |
| `template-sm-galeria-section.json` | Gallery | 6-photo grid → 3-col desktop / 2-col mobile |
| `template-sm-informacion-boda-section.json` | Ceremony & Reception | Times · Locations · Waze + GMaps buttons |
| `template-sm-itinerario-section.json` | Day itinerary | 2:30 PM → 10:00 PM timeline |
| `template-sm-vestimenta-hospedaje-section.json` | Dress code + Hotels | Color palette · Traje formal · Map links |
| `template-sm-mesa-regalos-section.json` | Gift registry | 3 cards: sobre · GTQ transfer · USD transfer |
| `template-sm-dedicatoria-section.json` | Guest dedication | Dark bg · Guest name + count (URL params) |
| `template-sm-rsvp-section.json` | RSVP with form | Embedded Bricks form · 4 fields · Dark bg |

---

## Image Placeholders

All images have `"id": 0` and empty `url`. After importing:
1. Open each template in Bricks Editor
2. Click each image element → select from WordPress Media Library
3. Upload photos from the `/photos/` folder of the static site

**Photos needed (upload to WordPress Media Library first):**
- `top-img.jpg` → Hero background
- `sergio-merilyn-retrato.jpeg` → Nuestra historia portrait
- `foto-01-retrato.jpg` through `foto-06.jpg` → Gallery

---

## Scripts & Styles

| File | Purpose | Where to put it |
|---|---|---|
| `sm-invitacion.js` | URL param guest personalization | Upload to `wp-content/themes/bodacervantessoto/assets/js/` |
| `sm-invitacion.css` | Design tokens, petals animation, form styles | Upload to `wp-content/themes/bodacervantessoto/assets/css/` |
| `sm-functions-snippet.php` | Enqueue both files | Add contents to `functions.php` |

### Alternative (no code access)
Paste the contents of `sm-invitacion.css` into:
**Bricks → Settings → Custom Code → CSS**

Paste the contents of `sm-invitacion.js` into:
**Bricks → Settings → Custom Code → Body (footer)**
Or use a **Code element** inside Bricks wrapped in `<script>` tags.

---

## Guest URL Format

Pre-populated invitation links work exactly like the static site:

```
https://bodacervantessoto.upbox.xyz/?nombre=Familia+García+López&invitados=2&show=yes
```

The JS reads `nombre`, `invitados`, and `show` parameters and:
- Injects the guest name into `#sm-guest-name` and `#sm-rsvp-guest-name`
- Injects the count into `#sm-guest-count`
- Shows/hides sections with CSS ID `#sm-dedicatoria-wrap` and `#sm-rsvp-wrap`

> **Important in Bricks**: Set the CSS ID on the outer Section element of both
> the dedicatoria and RSVP sections to `sm-dedicatoria-wrap` and `sm-rsvp-wrap`.

---

## Bricks Global Classes Required

These global classes should exist in your WordPress Bricks settings
(they are already in the original `bodacervantessoto` templates):

| Class name | Purpose |
|---|---|
| `grid-2-col` | 2-column CSS grid |
| `aos-slide-up` | AOS scroll-up animation trigger |
| `aos-btn` | AOS animation on buttons |
| `heroEffect` | Hero parallax scroll class |
