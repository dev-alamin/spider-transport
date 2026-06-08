# SPIDER Transport — HTML Scaffold

Static HTML prototype → will be converted to a WordPress Block Theme.

## Project structure

```
spider-transport/
├── index.html                        # Homepage
├── pages/
│   ├── funksjoner.html               # Features
│   ├── resultater.html               # Results
│   ├── hvordan-det-fungerer.html     # How it works
│   └── kontakt.html                  # Contact
├── assets/
│   ├── css/
│   │   ├── tokens.css                # All CSS custom properties (colors, fonts, spacing, motion)
│   │   └── main.css                  # Base reset, components, nav, footer, utilities
│   ├── js/
│   │   └── main.js                   # GSAP animations + vanilla JS interactions
│   ├── images/                       # Drop images / SVGs here
│   └── fonts/                        # Self-host fonts here if needed
└── README.md
```

## Stack

| Layer        | Tool                                          |
|-------------|----------------------------------------------|
| CSS utility  | Tailwind CSS (CDN)                           |
| Animations   | GSAP 3 + ScrollTrigger (CDN, minified)       |
| Interactions | Vanilla JS (migrates to WP Interactivity API)|
| Fonts        | DM Sans via Google Fonts                     |

> **No build tools.** Everything runs directly in the browser.

## Design tokens (tokens.css)

All design decisions live in CSS custom properties on `:root`:

- **Colors** — `--color-brand-blue`, `--color-black`, `--color-gray-*`, etc.
- **Typography** — `--font-sans`, `--text-*`, `--fw-*`, `--lh-*`, `--ls-*`
- **Spacing** — `--space-1` … `--space-32`, `--section-py`, `--container-max`
- **Radius** — `--radius-sm` … `--radius-full`
- **Shadows** — `--shadow-sm` … `--shadow-blue`
- **Motion** — `--ease-out-expo`, `--duration-fast` … `--duration-slower`
- **Z-index** — `--z-nav`, `--z-modal`, etc.

## Animation API

Add to any element in HTML, no JS needed:

```html
<div data-animate>            <!-- slides up + fades in on scroll -->
<div data-animate="fade">     <!-- fade only -->
<div data-animate="left">     <!-- slides in from left -->
<div data-animate="right">    <!-- slides in from right -->
<div data-animate="scale">    <!-- scales up + fades in -->

<!-- Optional modifiers -->
data-delay="0.2"              <!-- seconds delay -->
data-dur="0.9"                <!-- animation duration -->
```

**Stagger groups:**
```html
<ul data-stagger>
  <li data-stagger-item>...</li>
  <li data-stagger-item>...</li>
</ul>
```

**Counters:**
```html
<span data-counter="15" data-suffix="%">0%</span>
```

## WP Block Theme migration path

When converting to a Block Theme:

1. `tokens.css` → `theme.json` design tokens + keep as enqueued stylesheet
2. `main.css` → split into `style.css` (global) + block stylesheets
3. Vanilla JS interactions → `@wordpress/interactivity` store + `data-wp-*` directives
4. GSAP stays — enqueue via `wp_enqueue_script` with `strategy: 'defer'`
5. HTML pages → FSE templates in `templates/` + `parts/` (header, footer)
6. Nav active state → `navigation` block handles this natively

## Browser support

Modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions).
# spider-transport
