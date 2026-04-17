# McD Frontend Mockup

React + Vite rebuild of the `黄金十班次-教练反馈` mobile mockup.

## Stack

- React 18
- Vite
- `@aurum/pfe-ui`
- `@aurum/icons2`

## Local development

```bash
npm install
npm run dev
```

## Build for GitHub Pages

The source code lives under `app/`, while the production build outputs static files to the repository root so GitHub Pages can serve the site directly from the main branch.

```bash
npm run build
```

## Notes

- `legacy-source/` keeps the original static HTML files for reference during migration.
- The published GitHub Pages entry is the root `index.html`.
