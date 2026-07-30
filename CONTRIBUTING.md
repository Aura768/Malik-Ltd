# Contributing to Malik Ltd

Thank you for your interest in contributing to the Malik Ltd AI Developer Platform! This document outlines the guidelines for contributing.

## Code of Conduct

Be respectful, constructive, and professional. We're building the future of AI-assisted development.

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env` and fill in required values
4. Run `npm run dev` to start the development server

## Development Workflow

### Branching

- `main` — Production-ready state
- Feature branches: `feature/your-feature-name`
- Bug fixes: `fix/issue-description`

### Commit Messages

Use conventional commits:
- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code change without behavior change
- `docs:` — Documentation only
- `perf:` — Performance improvement
- `chore:` — Build process, tooling, dependencies

### Code Style

- TypeScript strict mode
- No `any` types (use `unknown` + type guards)
- Prefer `const` over `let`
- Use async/await over raw promises
- Use functional patterns where appropriate

## Architecture Overview

```
src/
├── server/          — Express 5 backend (ESM, .ts extensions)
│   ├── routes/      — 19 route files
│   ├── services/    — OpenCode, VS Code, AI chat managers
│   ├── middleware/   — Proxy, terminal bridge
│   └── utils/       — Feature modules (always-on, RAG, etc.)
├── [page]/          — Frontend pages (feature-first)
├── providers/       — 24-tier LLM fallback chain
├── theme/           — Black & white monochrome design system
└── utils/           — Shared frontend utilities
```

## Testing

- Unit tests: `npm test`
- TypeScript check: `npm run lint`
- Build: `npm run build`

## Pull Request Process

1. Update CHANGELOG.md with your changes
2. Ensure TypeScript compiles without errors
3. Update any affected documentation
4. Create PR against `main` with clear description

## Questions?

Open an issue or reach out to the team.
