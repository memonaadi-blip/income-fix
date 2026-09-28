# FINANSYS

A modern, animated marketing website for **FINANSYS** — a full-spectrum financial firm
offering investment advisory, tax planning, REIT registrations, ERP implementation,
business finance, and bookkeeping & financial services.

## Features
- Navy + gold brand theme with an animated financial-chart background
- Scroll-reveal animations, animated stat counters and a scroll-driven process timeline
- Clickable service cards that open detailed modals
- **Calendly** booking integration — clients schedule a free consultation and receive a video-call link
- Inline scheduler in the contact section + a sticky "Book a call" button
- Fully responsive and accessible (keyboard focus states, skip link, `prefers-reduced-motion`)

## Tech
Plain HTML, CSS and vanilla JavaScript — no build step.

- `index.html` — markup
- `styles.css` — styling, palette tokens and animations
- `script.js` — interactivity, service modals, chart background, Calendly wiring
- `logo.jpg` — brand logo (also used as favicon)

## Run locally
Open `index.html` in any browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Booking
Scheduling is powered by Calendly. The booking link lives in `script.js` (`CALENDLY_URL`).
