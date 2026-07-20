# Inkwake — Website

A multi-page, dark-mode freelance studio site for **Inkwake**, built with plain HTML/CSS/JS — no build step, no framework, **no local server required**. Every page is fully self-contained: just double-click any `.html` file and it opens and works directly in the browser.

## How it's structured (no server needed)
The nav bar and footer used to be loaded at runtime via `fetch()` from a shared `partials/` folder — but browsers block `fetch()` on `file://` URLs, which breaks that approach when you just open a file directly. So the header and footer markup is now **copied directly into every page's HTML**. There's no `partials/` folder anymore.

**Trade-off:** if you want to change something in the nav or footer (e.g. add a link, update the WhatsApp number label), you now need to make that edit in all 8 pages instead of one shared file. The one exception is contact details (WhatsApp, email, LinkedIn, Instagram) — those still live in a single place, `assets/js/include.js`, and are injected into every page automatically via JavaScript on load (see below), so you only need to update those in one spot.

## ⚠️ Do this first

1. **Web3Forms access key** — sign up free at [web3forms.com](https://web3forms.com), verify your email, and paste the Access Key into `web3formsAccessKey` in `assets/js/include.js`. Powers both the Contact form and the Careers application modal (PDF resumes included). Until set, both run in a safe demo mode — shows success, sends nothing (a console warning explains why).
2. **WhatsApp number** — set to `918546842549` (assuming `+91` India, since it was given without a country code) in `assets/js/include.js`. Double-check that prefix.
3. **Logo** — your uploaded logo is at `assets/images/logo.png` (nav/footer) and `assets/images/logo-mark.png` (hero art). Swap in your real SVG: save as `assets/images/inkwake-logo.svg` and update the `<img>` lines in `partials/header.html` / `partials/footer.html`.
4. **Founder card** — `partials/footer.html` has a placeholder founder name/photo. Update `assets/images/avatar.jpg` and the text in the `.founder-card` block.
5. **Placeholder photos** — `assets/images/project-*.jpg` and `avatar.jpg` are generated placeholders. Swap for real screenshots/photos, same filenames, or update `src` in `about.html` / `index.html`.
6. **Testimonials** — none included in this version (removed with the single-page layout); add a section if you'd like one back — ask and it can be re-added to About or Home.

## Pages
```
index.html     Home — hero/welcome, mission & vision, field of work, services, growth teaser, project teasers
about.html      About — full story, all projects (filterable), worklife, growth timeline, toolbox
career.html     Careers — Why Inkwake, open roles (Full Stack Developer, Data Engineer), Apply Now → modal form
contact.html     Contact — request-a-quote form, direct links, business hours
faq.html         FAQ accordion
terms.html        Terms & Conditions — with an "I accept" checkbox
privacy.html      Privacy Policy — with an "I accept" checkbox, covers Web3Forms data handling
404.html          Not-found page
```

## Navigation
- **Desktop:** logo + wordmark on the left, plain text links (Home / About / Careers / FAQ / Contact) in the center-right, "Start a Project" CTA button.
- **Mobile:** logo stays visible, a hamburger icon opens a full-height drawer that slides in from the right edge with the same links plus quick WhatsApp/CTA buttons.
- The current page is highlighted in the nav automatically (`data-page` attribute on `<body>`, matched in `assets/js/include.js`).

## Running it
Just open `index.html` directly by double-clicking it, or right-click → Open With → your browser. No server, no build step, nothing to install. Every page works the same way.

## Deploying
If/when you do put this on a real domain, upload the folder as-is to any static host (Netlify, Vercel, GitHub Pages, cPanel) — it'll work there too, server or not. Update `<link rel="canonical">` / `og:url` in each page (currently placeholder `https://www.inkwake.com/...`).

## Key features
- **Page-load transitions** — nav, main content, and footer fade + slide in from left to right on every page load (`.page-loaded` class, see bottom of `assets/css/style.css`).
- **Careers application modal** — "Apply Now" on either role opens a modal (not a new page) pre-selecting that role; the form posts to Web3Forms with a required resume upload and a required Terms/Privacy agreement checkbox.
- **Legal-page accept checkboxes** — Terms & Privacy each have a standalone "I accept" checkbox that persists in the browser via `localStorage` (separate from the required agreement checkbox inside the actual forms).
- **Cookie consent banner** — shows once per browser on first visit (any page), Accept/Decline, no tracking cookies actually set.
- **Parallax + reveal animations** — soft gold blobs drift on scroll on Home/About/Career; cards, timelines, and project grids fade in as you scroll.
- **Portfolio filter + hover overlay** (About page) — filter by category, hover a project card to see its tech stack and impact.

## Forms & Web3Forms
Both the Contact form and the Careers application modal POST to Web3Forms via `fetch()` once your access key is set — no backend, and the free tier supports PDF attachments (check their current size limit). Each form also requires checking an "I agree to Terms & Privacy" box before it will submit.

## Notes
- Fully responsive (mobile → desktop), visible focus states, and `prefers-reduced-motion` support.
- Legal copy in `terms.html` / `privacy.html` is a reasonable starting template, not legal advice — have it reviewed before publishing, especially given the third-party (Web3Forms) resume handling.
