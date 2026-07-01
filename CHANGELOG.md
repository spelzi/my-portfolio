# Changelog

All notable changes to this project will be documented in this file.

The format is based on **Keep a Changelog** and this project follows **Semantic Versioning (SemVer)**.

---

---

## [1.1.0] - 2026-06-30

### Added

- Full Vitest + React Testing Library test suite (183 tests, ~91% statement coverage)
- Test execution wired into CI (runs on every push and pull request)
- `.env.example` for local environment setup

### Changed

- Migrated admin authentication from a client-exposed `VITE_ADMIN_PASSWORD` to JWT-based auth backed by the Node/Express API
- Hardened the backend with Helmet, rate limiting, stricter CORS, and request body size limits
- Fixed ESLint configuration to scope correctly to source files and recognize test-environment globals

### Fixed

- Contact form pointed at a localhost URL instead of the deployed backend
- React hooks ordering violation in `AdminPanel`
- Leaked credential removed from git history

### Security

- JWT token expiry checked client-side via `AdminStore.isAuthed`
- CodeQL static analysis added (weekly scheduled scan + on every push/PR)
- Dependabot enabled for npm dependency updates

---

## [1.0.0] - 2026-06-29

### 🎉 Initial Release

This marks the first public release of the portfolio website.

### Added

- Modern React 19 frontend
- Vite build system
- Responsive UI using Bootstrap
- React Router navigation
- Professional landing page
- About page
- Portfolio showcase
- Blog section
- Blog details page
- Video gallery
- Contact page
- Resume download
- Cover letter download
- Custom loading screen
- Error Boundary
- Responsive navigation
- Footer
- Reusable components
- Admin dashboard
- Blog management
- Portfolio management
- Video management
- ESLint configuration
- Environment variable support
- Production-ready project structure

---

### Security

- Environment variables implemented
- Error boundary protection
- Sensitive configuration isolated from source code

---

### Performance

- Fast development with Vite
- Optimized production builds
- Component-based architecture
- Responsive design
- Modular routing

---

## Future Releases

Upcoming releases may include:

### Planned

- Authentication improvements
- CMS integration
- Dark mode
- Project search
- Blog categories
- Analytics dashboard
- Docker support
- End-to-end testing
- Performance optimizations
- Accessibility enhancements
- SEO improvements

---

## Versioning

This project follows Semantic Versioning.

Version format:

MAJOR.MINOR.PATCH

Example:

- **1.0.0** → Initial release
- **1.1.0** → New features
- **1.1.1** → Bug fixes
- **2.0.0** → Breaking changes

---

## Release Notes

Each release includes:

- New features
- Improvements
- Bug fixes
- Performance enhancements
- Security updates
- Documentation updates

For more information, visit the GitHub Releases page.
