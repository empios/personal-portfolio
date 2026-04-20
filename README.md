# Personal Portfolio

A static Next.js portfolio configured for deployment to GitHub Pages.

## Requirements

- Node.js 20+
- npm 10+

## Run locally

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:3000

## Production build (local check)

```bash
npm run build
```

The static site output is generated in `out/` (from Next.js `output: "export"`).

## Deploy to GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that:

1. Installs dependencies (`npm ci`)
2. Computes the correct base path for GitHub Pages
   - Project Pages repo (`<repo>`): `/<repo>`
   - User/Org Pages repo (`<user>.github.io`): empty base path
3. Builds the static site (`npm run build`)
4. Uploads `out/` and deploys it to GitHub Pages

### One-time GitHub setup

1. In your GitHub repository, go to **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Ensure your deployment branch is `main` or `master` (or update workflow trigger branches).

After setup, every push to `main`/`master` triggers deployment.

## Troubleshooting GitHub Pages

- **Blank page / missing assets**: Usually base path mismatch. This workflow auto-detects whether to use `/<repo-name>` or root (`""`).
- **404 on project pages**: Confirm Pages source is set to **GitHub Actions** and deploy job succeeds.
- **Build failures in CI**: Run `npm ci && npm run build` locally first to reproduce.

## CV PDF setup

To make the **cv** link work, add your resume file at:

- `public/cv.pdf`

It will be available at `/cv.pdf` (or `<basePath>/cv.pdf` on GitHub Pages project sites).
