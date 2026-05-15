# Personal Portfolio

A single-page React portfolio built with Vite and TypeScript, configured for deployment to GitHub Pages.

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

3. Open http://localhost:5173

## Production build (local check)

```bash
npm run build
```

The static site output is generated in `dist/`.

To preview the production build locally:

```bash
npm run preview
```
## CV PDF setup

To make the **cv** link work, add your resume file at:

- `public/cv.pdf`

It will be available at `/cv.pdf` (or `<base>/cv.pdf` on GitHub Pages project sites).
