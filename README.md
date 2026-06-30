# Foundatio Lume Theme

A Lume theme for Foundatio technical sites. It currently provides polished docs
pages, homepage sections, generated navigation, local search, Shiki code blocks,
LLM files, markdown mirrors, redirects, and GitHub Pages-friendly pretty URLs.

The package is intentionally named as a broader site theme, not a docs-only
theme, so it can grow into blog, news, and other Foundatio site sections over
time.

## Usage

```ts
import lume from "lume/mod.ts";
import foundatio from "jsr:@foundatio/lume-theme@0.1.1";

const location = new URL("https://example.com");
const site = lume({
  location,
  prettyUrls: true,
});

site.use(foundatio({
  title: "Foundatio Project",
  description: "Documentation and project site",
  location,
  brand: {
    label: "Project",
    logoLight: "https://example.com/logo.svg",
    logoDark: "https://example.com/logo-dark.svg",
    icon: "https://example.com/icon.png",
  },
  docsRoot: "guide",
  nav: [
    { text: "Guide", link: "/guide/getting-started", activeMatch: "^/guide/" },
  ],
}));

export default site;
```

## Development

```bash
deno task fmt
deno task check
deno task publish:dry-run
```

## License

MIT
