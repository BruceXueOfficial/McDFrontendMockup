# McD Frontend Mockup

React + Vite rebuild of the 黄金十班次 mobile mockup.

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

The source code lives under `app/`, while the production build outputs static files to `mockup_builds/黄金十班次/<Feature-Name>/` for GitHub Pages.

```bash
npm run build
```

## GitHub Pages

Each feature has its own folder under `mockup_builds/黄金十班次/`:
- `Feature-CoachFeedbackReview-V1/` - 教练反馈页面
- `Feature-DutyOverview-V1/` - 值班总览页面

## Notes

- `legacy-source/` keeps the original static HTML files for reference during migration.
- `app/` contains the Vue/React source code.
