# Income Fix

A modern, animated, futuristic marketing website for **Income Fix** — a financial-advisory practice
offering investment advisory, tax planning, wealth protection, retirement planning, cash-flow and
business-finance services.

## Features
- Animated particle-network background, cursor glow and self-drawing SVG graphics
- Scroll-reveal animations, animated stat counters and a scroll-driven process timeline
- Clickable service cards that open detailed modals
- **Calendly** booking integration — clients schedule a free 30-min call and receive a video-call link
- Inline scheduler in the contact section + a sticky "Book a call" button
- Fully responsive and accessible (keyboard focus states, skip link, `prefers-reduced-motion`)

## Tech
Plain HTML, CSS and vanilla JavaScript — no build step.

- `index.html` — markup
- `styles.css` — styling and animations
- `script.js` — interactivity, modals, Calendly wiring

## Run locally
Open `index.html` in any browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Booking
Scheduling is powered by Calendly. The booking link lives in `script.js` (`CALENDLY_URL`).
