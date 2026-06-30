---
title: Getting Started
description: Start using the Foundatio Lume theme
nav:
  section: Introduction
  sectionOrder: 1
  order: 1
---

# Getting Started

Foundatio Theme is a Lume theme for technical project sites. It keeps the site configuration small while the theme handles navigation, outlines, search, code blocks, markdown mirrors, and LLM-friendly output.

[[toc]]

## Install the package

Use the JSR package from a Lume site:

```ts
import lume from "lume/mod.ts";
import foundatio from "jsr:@foundatiofx/lume-theme";

const site = lume({ prettyUrls: true });
site.use(foundatio({
  title: "My Project",
  description: "Project documentation",
  docsRoot: "guide",
  lume: { basePath, checkUrls, markdown, metas, sitemap },
}));

export default site;
```

## Configure navigation

Navigation is generated from markdown front matter. Sections are sorted with `sectionOrder`, and pages within a section are sorted with `order`.

```yaml
---
title: Getting Started
nav:
  section: Introduction
  sectionOrder: 1
  order: 1
---
```

::: tip
Use normal Lume project structure. The theme should be a plugin in your `_config.ts`, not a wrapper around `lume()`.
:::

## Add content

Create markdown files under the docs root, then link between pages with clean URLs such as [Components](/guide/components).

```csharp
public record BuildSite(string Name);

public class BuildSiteHandler
{
    public string Handle(BuildSite command) => $"Built {command.Name}";
}
```

## Next steps

Read the [component reference](/guide/components) to see cards, callouts, code blocks, and generated support files.
