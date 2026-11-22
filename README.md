# BernatBC portfolio

The portfolio is a full-screen Three.js workshop. Click an object, its marker,
or a destination to open its content panel; drag to look around and use the
reset button to restore the view. Keyboard shortcuts 1–5 select destinations,
R resets the view, and Escape or the close button returns to the room. Articles,
media and games open in the same workshop. The library can be searched and
filtered by project type. Reduced-motion preferences are respected, and the
content remains available when JavaScript or WebGL is unavailable.

## Development

Install dependencies with `bun install`, then run `hugo server` to preview the
site. Build the production site with `hugo --minify`. Hugo Extended is required.

The workshop markup is in `layouts/partials/workshop.html`, its styling is in
`assets/styles/workshop.css`, and the Three.js scene is in
`assets/js/workshop.js`. Portfolio information is sourced from `data/` and
articles from `content/posts/`; existing article URLs open the workshop's
reader. Hugo bundles Three.js from the installed dependencies, and the GitHub
Pages deployment builds the site in the same way.
