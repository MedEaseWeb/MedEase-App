# Contributing & Git Workflow

## Getting latest code

Always base your work on `dev`:

```bash
git checkout dev
git pull origin dev
```

## New features

1. **Create a feature branch** from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat:your-feature-name
   ```
   Use a short, kebab-case feature name (e.g. `feat:survey-routing`, `feat:login-validation`).

2. **Develop** on `feat:your-feature-name`. Commit and push to that branch.

3. **Open a Pull Request** into `dev` only. Do not open PRs into `main`.

## Rules

- **DO NOT PUSH TO MAIN.** All changes go to `dev` via feature branches and PRs.
- Get latest code from `dev` before starting a new feature.
- Merge to `main` only through your team’s release process (e.g. after merging `dev` → `main` when releasing).
