## Repository guidance

This Astro site is structured around small, content-focused pages for Z-plus.

### Quick context
- Page markup lives in `src/pages`.
- Shared layout and navigation live in `src/layouts/BaseLayout.astro`.
- Global styling is in `src/styles/global.css`.

### Working conventions
- Keep content changes in the relevant page file and update navigation links when adding pages.
- Maintain consistent headings (`h1` per page, `h2` for sections).
- Run `npm install` once, then `npm run dev` for local development.
