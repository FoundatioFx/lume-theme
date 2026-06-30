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
import basePath from "lume/plugins/base_path.ts";
import checkUrls from "lume/plugins/check_urls.ts";
import markdown from "lume/plugins/markdown.ts";
import metas from "lume/plugins/metas.ts";
import sitemap from "lume/plugins/sitemap.ts";
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
  lume: { basePath, checkUrls, markdown, metas, sitemap },
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

The theme accepts the Lume plugin factories through `lume` so the consuming site
controls the Lume version. That keeps the package publishable on JSR and avoids
bundling a second copy of Lume inside the theme.

## Development

```bash
deno task fmt
deno task check
deno task publish:dry-run
```

## License

MIT
