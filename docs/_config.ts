import lume from "lume/mod.ts";
import basePath from "lume/plugins/base_path.ts";
import checkUrls from "lume/plugins/check_urls.ts";
import markdown from "lume/plugins/markdown.ts";
import metas from "lume/plugins/metas.ts";
import sitemap from "lume/plugins/sitemap.ts";
import foundatio from "foundatio-theme";

const location = new URL("https://theme.foundatio.dev/");
const site = lume({
  location,
  prettyUrls: true,
  dest: "_site",
});

site.copy("public", ".");

site.use(foundatio({
  title: "Foundatio Theme",
  description: "Dogfood site for the Foundatio Lume theme",
  location,
  basePath: "/",
  lume: { basePath, checkUrls, markdown, metas, sitemap },
  brand: {
    label: "Theme",
    logoLight:
      "https://raw.githubusercontent.com/FoundatioFx/Foundatio/master/media/foundatio.svg",
    logoDark:
      "https://raw.githubusercontent.com/FoundatioFx/Foundatio/master/media/foundatio-dark-bg.svg",
    icon:
      "https://raw.githubusercontent.com/FoundatioFx/Foundatio/main/media/foundatio-icon.png",
    themeColor: "#3c8772",
  },
  docsRoot: "guide",
  nav: [
    {
      text: "Guide",
      link: "/guide/getting-started",
      activeMatch: "^/guide/",
    },
    {
      text: "GitHub",
      link: "https://github.com/FoundatioFx/lume-theme",
    },
  ],
  social: [
    {
      label: "GitHub",
      link: "https://github.com/FoundatioFx/lume-theme",
      class: "github",
    },
  ],
  footer: {
    message: "Released under the MIT License.",
    copyright: "Copyright 2026 Foundatio",
  },
  editLink: {
    pattern: "https://github.com/FoundatioFx/lume-theme/edit/main/docs/:path",
  },
  lastUpdated: false,
  llms: true,
  markdownMirrors: true,
}));

export default site;
