# Agent.md

## Project Scope
- This repository contains the Jekyll source for `https://tai-psy.com`.
- Primary edit targets are Markdown pages/posts and assets under `assets/`.

## Stack
- Jekyll `~> 4.4.1`
- Ruby/Bundler (`Gemfile`, `Gemfile.lock`)
- Plugins: `jekyll-feed`, `jekyll-sitemap`
- Site config: `_config.yml`

## Important Paths
- `_posts/`: blog posts (`YYYY-MM-DD-title.md`)
- `_layouts/`: page/post layouts
- `_includes/`: shared partials (header/footer/etc.)
- `assets/css/`: styles
- `assets/js/`: frontend scripts
- `index.md`: homepage
- `pages/*.md`: header-level static pages (for example `/about-me/` -> `pages/about-me.md`)
- `pages/categories/*.md`: category pages (for example `/r/` -> `pages/categories/r.md`)
- `_site/`: generated output (do not hand-edit)

## Editing Rules
- Never edit `_site/` directly. Edit source files only.
- Keep existing front matter conventions.
- Preserve current layout names exactly (for example `layout: defalt`).
- Save text files as UTF-8.

## Local Commands
1. Install gems: `bundle install`
2. Run dev server: `bundle exec jekyll serve`
3. Build site: `bundle exec jekyll build`

## Change Checklist
1. Verify internal links and navigation.
2. Check homepage and post-list routing (`index.md`, `pages/column.md`) and category cards under `pages/categories/`.
3. Confirm post metadata renders correctly (date/category/excerpt).
4. Restart server after `_config.yml` changes.

## Priorities For Future Agents
1. Keep existing content tone and structure stable.
2. Prefer small, source-level changes over broad rewrites.
3. Avoid adding new dependencies unless required.



