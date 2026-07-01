<div align="center">

# St Manuel — Personal Portfolio

**A production React 19 + Vite 8 SPA with build-time prerendering, a JWT-secured admin panel, and a full Vitest test suite — built for a full stack developer, crypto/forex trader, and business consultant.**

[![CI](https://github.com/spelzi/my-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/spelzi/my-portfolio/actions/workflows/ci.yml)
[![CodeQL](https://github.com/spelzi/my-portfolio/actions/workflows/codeql.yml/badge.svg)](https://github.com/spelzi/my-portfolio/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](package.json)
[![Tests](https://img.shields.io/badge/tests-183%20passing-brightgreen)](tests/)
[![Coverage](https://img.shields.io/badge/coverage-~91%25-green)](tests/)

[Report a Bug](https://github.com/spelzi/my-portfolio/issues/new?template=bug_report.md) · [Request a Feature](https://github.com/spelzi/my-portfolio/issues/new?template=feature_request.md)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [SEO & Prerendering](#seo--prerendering)
- [Deployment](#deployment)
- [Security](#security)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## About

Personal portfolio for **Emmanuel Chidiebube Uzor (St Manuel)** — covering full stack web development, crypto/forex trading, and business consulting. Built and maintained as a working demonstration of production engineering practices: proper SEO architecture, a complete test suite, JWT-based auth, CI/CD, and security hardening.

---

## Features

### Public site

- Animated landing page — hero, role typelist, profile sidebar, experience/education timeline
- About page with skill set cards, LinkedIn CTA, certifications, and a lightbox image viewer
- Portfolio ("Past Work") grid with live status badges (Live / In Progress / Coming Soon)
- Blog with full post pages (headings, blockquotes, bullet lists), prev/next navigation, and per-post SEO
- Video library with lazy-loaded YouTube iframe embeds (mounts only on hover to save bandwidth)
- Contact form with client-side validation, timeout handling, and a success/error modal
- Resume and Cover Letter download section (inline PDF preview + open-in-new-tab)
- Global page-transition loader with a branded animation on every route change
- Custom 404 page with `noindex` meta to keep it out of Google's index

### Admin panel (`/admin`)

- JWT-based login — no client-exposed password; auth is handled entirely by the backend API
- Dashboard with live counts of posts, projects, and videos
- Full CRUD for blog posts, past work projects, and YouTube videos
- Blog editor with a lightweight Markdown-like body parser: `##` headings, `>` blockquotes, `- ` bullets
- Content persists to `localStorage` and overrides the site's default seed data on next load

### SEO & social

- Per-page `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph, and Twitter Card tags
- Build-time prerendering: every public route ships its own pre-filled `index.html` so link-unfurling bots (LinkedIn, WhatsApp, X, Slack) see real per-page content without executing JavaScript
- JSON-LD structured data: `Person` (homepage/about), `BlogPosting` + `BreadcrumbList` (blog posts)
- `sitemap.xml` generated at build time from the same route list as the prerender script (can never drift out of sync)
- `robots.txt` — allows all crawlers, blocks `/admin`, references the sitemap
- Favicons for all platforms: 16px, 32px, 180px Apple Touch Icon, 192px and 512px Android Chrome
- PWA Web App Manifest
- 1200×630 Open Graph image in the site's dark-gold aesthetic

---

## Tech Stack

| Category                | Technology                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------- |
| UI Framework            | React 19                                                                               |
| Build Tool              | Vite 8                                                                                 |
| Routing                 | React Router DOM v7                                                                    |
| Styling                 | Bootstrap 5, React Bootstrap, Font Awesome 6, Google Fonts (Cormorant Garamond, Inter) |
| Animation               | Lottie React (lazy-loaded — dynamic import in `useEffect` for SSR safety)              |
| Testing                 | Vitest, React Testing Library, jsdom, @vitest/coverage-v8                              |
| Linting / Formatting    | ESLint 9 (flat config), Prettier                                                       |
| Git Hooks               | Husky, lint-staged, Commitlint (Conventional Commits)                                  |
| CI/CD                   | GitHub Actions (lint → test → build), CodeQL (weekly + on every push/PR), Dependabot   |
| Backend (separate repo) | Node / Express, JWT, Helmet, rate limiting — deployed on Railway                       |

---

## Architecture

**Frontend-only repo.** No database, no server. The full architecture in one sentence: the frontend is a Vite-built React SPA that makes exactly two network calls (contact form and admin login), stores admin-managed content in `localStorage`, and is prerendered to static HTML at build time so every page has correct SEO tags before a browser opens it.

Key design decisions:

**Two network calls, total.** `POST /send-email` (contact form) and `POST /api/auth/login` (admin sign-in). Everything else — routing, state, content rendering — is local.

**Auth boundary.** `/admin` is a standalone route with no public nav or footer. `AdminStore.isAuthed()` checks a JWT's expiry client-side; the token is only issued by the backend. No password lives anywhere in this repo.

**Content without a CMS.** Blog posts, projects, and videos have default seed values in `postsData.js` and `videosData.js`. The admin panel writes overrides to `localStorage`. The public pages merge both: `AdminStore.getPosts(defaultPosts)` — localStorage wins if present, defaults otherwise.

**SSR-safe Lottie.** `Anima.jsx` loads `lottie-react` via a dynamic `import()` inside `useEffect`, which defers the player to after hydration. This sidesteps a CJS/ESM interop crash in `lottie-react` under `renderToString`, eliminates hydration mismatch risk, and has zero visual cost since the animation only starts after JS loads anyway.

**Prerender over runtime SSR.** Rather than a Node server that renders on every request, we prerender all 11 public routes to static HTML at build time (`scripts/prerender.mjs`). The result is deployable to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages) with no server required.

---

## Project Structure

```
my-portfolio/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml          # lint → test → full build pipeline
│   │   ├── codeql.yml      # static security analysis
│   │   └── deploy.yml      # deployment placeholder (configure for your host)
│   ├── ISSUE_TEMPLATE/
│   ├── dependabot.yml      # keeps npm + GitHub Actions up to date
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
├── public/
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── og-image.jpg        # 1200×630 social preview card
│   ├── robots.txt
│   └── site.webmanifest
├── scripts/
│   ├── prerender.mjs       # renders all 11 routes to dist/<route>/index.html
│   └── sitemap.mjs         # generates dist/sitemap.xml
├── src/
│   ├── seo/
│   │   ├── seoConfig.js    # metadata, JSON-LD, route list — shared by useSeo + prerender
│   │   └── useSeo.js       # React hook — syncs tags live during SPA navigation
│   ├── Component/
│   │   ├── Admin/          # AdminPanel, AdminLogin, AdminDashboard,
│   │   │                   # AdminBlog, AdminPastWork, AdminVideos, AdminStore
│   │   ├── Styling/        # one .css file per page/feature
│   │   ├── image/          # photos, logo, certificates
│   │   ├── Documents/      # resume + cover letter PDFs (git-ignored)
│   │   ├── Home.jsx
│   │   ├── AboutMe.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   ├── BlogVideo.jsx
│   │   ├── PastWork.jsx
│   │   ├── Contact.jsx
│   │   ├── MainNav.jsx
│   │   ├── PageLoader.jsx
│   │   ├── LoadingButton.jsx
│   │   ├── DownloadSection.jsx
│   │   ├── Anima.jsx       # SSR-safe Lottie wrapper (dynamic import)
│   │   ├── postsData.js    # default blog post seed data
│   │   └── videosData.js   # default video seed data
│   ├── entry-server.jsx    # SSR entry point (build-time only, not in browser bundle)
│   ├── App.jsx             # routes, page-transition loader, 404 page
│   ├── main.jsx
│   └── index.css
├── tests/
│   ├── components/         # 17 component test files
│   ├── AdminStore.test.js
│   ├── App.test.jsx
│   ├── setup.js
│   └── test-utils.jsx
├── .env.example            # documents all required env vars
├── eslint.config.js        # flat config with browser/node/vitest scopes
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
git clone https://github.com/spelzi/my-portfolio.git
cd my-portfolio
npm install
cp .env.example .env
# then fill in the values — see Environment Variables below
npm run dev
```

The dev server runs at `http://localhost:5173`.

---

## Environment Variables

Copy `.env.example` to `.env` and set both values:

| Variable           | Required        | Description                                                                              | Example                                                       |
| ------------------ | --------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `VITE_BACKEND_URL` | Yes             | Base URL of the Railway backend API. Used by the contact form and admin login.           | `https://my-portfolio-backend-production-xxxx.up.railway.app` |
| `VITE_SITE_URL`    | Yes (for build) | Public URL of this frontend. Used for canonical links, OG image URLs, and `sitemap.xml`. | `https://your-domain.com`                                     |

`VITE_SITE_URL` defaults to `https://your-domain.com` if not set — the build won't fail, but every canonical URL and sitemap entry will use the placeholder. Set the real value in your `.env` and in CI before deploying.

In GitHub Actions, add both as repository secrets (`VITE_BACKEND_URL` and `VITE_SITE_URL`) — the CI workflow passes them to the build step automatically.

---

## Available Scripts

| Command                 | Description                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`           | Start the Vite dev server                                                            |
| `npm run build`         | Full production build: client → SSR bundle → prerender all routes → generate sitemap |
| `npm run build:client`  | Client bundle only (`dist/`)                                                         |
| `npm run build:ssr`     | SSR bundle only (`dist-ssr/`) — used by the prerender script                         |
| `npm run prerender`     | Render all 11 public routes to static HTML with baked-in SEO tags                    |
| `npm run sitemap`       | Generate `dist/sitemap.xml`                                                          |
| `npm run preview`       | Preview the production build locally                                                 |
| `npm run lint`          | Run ESLint                                                                           |
| `npm run lint:fix`      | Run ESLint with auto-fix                                                             |
| `npm run format`        | Format the codebase with Prettier                                                    |
| `npm run format:check`  | Check formatting without writing changes                                             |
| `npm test`              | Run the test suite once (watch mode in interactive terminals)                        |
| `npm run test:watch`    | Explicit watch mode                                                                  |
| `npm run test:ui`       | Vitest UI (visual test browser)                                                      |
| `npm run test:coverage` | Run tests with a v8 coverage report                                                  |

---

## Testing

**Vitest + React Testing Library**, with `jsdom` as the environment.

```bash
npm test             # run once
npm run test:watch   # watch mode while developing
npm run test:coverage
```

**183 tests across 19 test files**, covering:

- Routing (`App.test.jsx`) — all 6 public routes + admin route + 404
- `AdminStore` — JWT expiry, localStorage CRUD, login fetch flow (success, failure, network error)
- Every public page — `Home`, `AboutMe` (lightbox), `Blog`, `BlogPost` (valid slug + not-found), `BlogVideo`, `PastWork`
- Every admin section — `AdminBlog`, `AdminPastWork`, `AdminVideos` (full CRUD flow for each)
- `AdminLogin` — controlled loading, double-submit prevention, error clearing
- `AdminPanel` — tab switching, mobile sidebar, logout flow
- `Contact` — validation, submission, timeout/abort/server-error handling, modal dismiss
- UI components — `MainNav` (active links, hamburger, Escape key), `PageLoader`, `LoadingButton` (controlled + self-managed async), `Anima` (async Lottie mount), `DownloadSection`

**Current status: ~91% statement coverage.** Tests run automatically in CI on every push and pull request, and locally via a Husky pre-commit hook (`npm test`).

---

## SEO & Prerendering

### Why prerendering, not `react-helmet`

Setting meta tags in `useEffect` (the standard SPA approach) works for Googlebot, which executes JavaScript. But link-unfurling bots — LinkedIn, WhatsApp, X, Facebook, Slack, Discord — fetch raw HTML and stop. For a pure SPA they'd all read the same empty `index.html` and show the same generic card regardless of which page was shared.

The fix is **build-time prerendering**: `scripts/prerender.mjs` uses `renderToString` + `StaticRouter` to render each public route, then writes the result to `dist/<route>/index.html` with the correct `<title>`, `<meta>`, Open Graph, and JSON-LD tags already present in the raw HTML. Every shared link shows a unique, accurate preview card.

### How it works

```
npm run build
  └── vite build              → dist/ (client bundle)
  └── vite build --ssr        → dist-ssr/ (server bundle)
  └── node scripts/prerender  → dist/aboutme/index.html, dist/blog/*/index.html, etc.
  └── node scripts/sitemap    → dist/sitemap.xml
```

The SPA fully hydrates in the browser as normal. React's first render matches the prerendered HTML exactly (no hydration mismatch), so there's no flash or re-render on load.

### Per-page metadata summary

| Route         | Title                                 | OG Type   | JSON-LD                         |
| ------------- | ------------------------------------- | --------- | ------------------------------- |
| `/`           | Emmanuel Chidiebube Uzor \| St Manuel | `profile` | `Person`                        |
| `/aboutme`    | About \| Emmanuel Uzor                | `profile` | `Person`                        |
| `/blog`       | Blog \| Emmanuel Uzor                 | `website` | `Person`                        |
| `/blog/:slug` | Post title \| Emmanuel Uzor           | `article` | `BlogPosting`, `BreadcrumbList` |
| `/pastwork`   | Past Work \| Emmanuel Uzor            | `website` | —                               |
| `/blogvideo`  | Videos \| Emmanuel Uzor               | `website` | —                               |
| `/*` (404)    | Page Not Found \| Emmanuel Uzor       | `website` | `noindex, nofollow`             |

### One step required before deploying

Replace `https://your-domain.com` with your real URL in `VITE_SITE_URL` (`.env` and CI secrets). Every canonical URL, OG image path, sitemap entry, and structured data URL updates automatically on the next build.

---

## Deployment

**Frontend** (`dist/`) is a static build deployable to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host. Because every route is prerendered to its own `index.html`, no special SPA redirect rules are needed for direct URL access or refresh.

**Backend** (separate repo) runs on Railway and handles the contact form and admin auth.

**CI** (`.github/workflows/ci.yml`) runs lint → test → full build on every push and PR to `main`, `master`, and `develop`. It also needs `VITE_BACKEND_URL` and `VITE_SITE_URL` as GitHub Actions secrets (Settings → Secrets and variables → Actions) so the build step uses real values.

**`deploy.yml`** is currently a placeholder. To wire it up, add your hosting provider's deploy action after the build step (e.g. `actions/upload-pages-artifact` + `actions/deploy-pages` for GitHub Pages, or Vercel/Netlify CLI).

---

## Security

See [`SECURITY.md`](SECURITY.md) for the full policy and how to report vulnerabilities privately.

Highlights:

- Admin auth is JWT-based. No password is stored or shipped in this repo — it lives in the backend only.
- [CodeQL](https://github.com/spelzi/my-portfolio/actions/workflows/codeql.yml) runs static analysis on every push, PR, and weekly on a schedule.
- [Dependabot](.github/dependabot.yml) keeps both npm packages and GitHub Actions up to date.
- `robots.txt` blocks `/admin` from all crawlers.
- The backend is hardened with Helmet, rate limiting, strict CORS, and body size limits.

---

## Roadmap

- [ ] Replace `VITE_SITE_URL` placeholder with live domain (once deployed)
- [ ] Wire `deploy.yml` to a real hosting target
- [ ] Dark mode
- [ ] CMS integration (replace `localStorage` content with a real backend store)
- [ ] Blog search and category filtering
- [ ] Analytics dashboard in the admin panel
- [ ] End-to-end tests (Playwright or Cypress)
- [ ] Docker support
- [ ] Accessibility audit (WCAG 2.1 AA target)
- [ ] Performance pass: lazy-route splitting, image optimisation, Core Web Vitals

See [`CHANGELOG.md`](CHANGELOG.md) for what's already shipped.

---

## Contributing

Contributions, issues, and feature requests are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md) for setup, branch naming, commit conventions, and the PR checklist. Please also read [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

Quick version:

```bash
git clone https://github.com/spelzi/my-portfolio.git
cd my-portfolio && npm install
cp .env.example .env   # fill in both env vars
npm run dev
```

Then: make your change → `npm run lint` → `npm test` → open a PR using the template.

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

## Author

**Emmanuel Chidiebube Uzor** — Full Stack Web Developer · Crypto & Forex Trader · Business Consultant

- GitHub: [@spelzi](https://github.com/spelzi)
- LinkedIn: [emmanuel-chidiebube-uzor](https://www.linkedin.com/in/emmanuel-chidiebube-uzor)
- Telegram: [@stmempire](https://t.me/stmempire)
- X / Twitter: [@st_manuel1](https://x.com/st_manuel1)

<div align="center">
<sub>Built with React 19, Vite 8, and proper engineering.</sub>
</div>
