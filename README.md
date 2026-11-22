# BernatBC portfolio

The portfolio is a full-screen Three.js workshop. Click an object or choose a
destination to open its content panel, drag to look around, and use Escape or
the close button to return to the room. Articles, media and games open in the
same workshop. The content remains available when JavaScript or WebGL is
unavailable.

## Development

Install dependencies with `bun install`, then run `hugo server` to preview the
site. Build the production site with `hugo --minify`. Hugo Extended is required.

The workshop markup is in `layouts/partials/workshop.html`, its styling is in
`assets/styles/workshop.css`, and the Three.js scene is in
`assets/js/workshop.js`. Portfolio information is sourced from `data/` and
articles from `content/posts/`; existing article URLs open the workshop's
reader. Hugo bundles Three.js from the installed dependencies, and the GitHub
Pages deployment builds the site in the same way.
