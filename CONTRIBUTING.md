# Contributing Guide

First off, thank you for considering contributing to this project!

This portfolio is maintained by **Emmanuel Chidiebube Uzor**. Contributions are welcome and appreciated. Whether you're fixing a bug, improving documentation, optimizing performance, or proposing new features, your help is valuable.

---

# Table of Contents

- Code of Conduct
- Getting Started
- Development Setup
- Branch Naming
- Commit Messages
- Pull Requests
- Coding Standards
- Reporting Bugs
- Suggesting Features

---

# Code of Conduct

Please read the project's `CODE_OF_CONDUCT.md` before contributing.

Be respectful, constructive, and professional in all interactions.

---

# Getting Started

## 1. Fork the repository

Click **Fork** at the top-right of this repository.

---

## 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/my-portfolio.git
cd my-portfolio
```

---

## 3. Install dependencies

```bash
npm install
```

---

## 4. Create your environment file

```bash
cp .env.example .env
```

Update the environment variables before starting the project.

---

## 5. Start the development server

```bash
npm run dev
```

---

## 6. Run the test suite

```bash
npm test            # run once
npm run test:watch  # watch mode while developing
npm run test:coverage  # run with a coverage report
```

A pre-commit hook (via Husky) runs `npm test` automatically before each commit.

---

# Branch Naming

Please use descriptive branch names.

Examples:

```
feature/contact-form

feature/admin-dashboard

fix/navbar-overflow

fix/blog-pagination

docs/update-readme

refactor/project-card
```

---

# Commit Messages

Follow conventional commit messages whenever possible.

Examples:

```
feat: add contact form validation

fix: resolve mobile navigation bug

docs: update README

style: improve spacing on home page

refactor: simplify routing logic

chore: update dependencies
```

---

# Pull Requests

Before submitting a Pull Request:

- Ensure the project builds successfully (`npm run build`).
- Run ESLint (`npm run lint`).
- Run the test suite and confirm it passes (`npm test`).
- Keep Pull Requests focused on a single feature or fix.
- Update documentation if needed.

---

# Coding Standards

Please follow these guidelines:

- Use meaningful variable names.
- Keep components reusable.
- Prefer functional React components.
- Remove unused imports.
- Keep files organized.
- Write clean, readable code.

---

# Reporting Bugs

When reporting a bug, include:

- Operating System
- Browser
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

---

# Suggesting Features

Feature requests should include:

- Problem statement
- Proposed solution
- Possible alternatives
- Additional context

---

# Questions

If you have questions, feel free to open an issue.

Thank you for helping improve this project!
