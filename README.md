# felicialimanta.fyi

A static, minimalist personal site for sharing writings. No database, no server at runtime; everything is prerendered to static HTML at build time with SvelteKit + `@sveltejs/adapter-static`.

## Requirements

- Node `24` (see `.nvmrc`; `nvm use` picks it up automatically)

## Developing

```sh
npm install
npm run dev -- --open
```

## Building

```sh
npm run build
```

Static output is written to `build/`. Preview it locally with:

```sh
npm run preview
```

## Adding an article

Articles live under `articles/`, one directory per article:

```
articles/
  20260716_life-after-graduation/
    article.md
    img123.png
```

- The directory name must be `YYYYMMDD_slug` — the date prefix becomes the published date, and `slug` becomes the URL (`/articles/life-after-graduation`).
- `article.md` starts with frontmatter (`title`, `description`), followed by the Markdown body.
- The build fails if two articles share the same `slug` or `title` — rename one to fix it.
