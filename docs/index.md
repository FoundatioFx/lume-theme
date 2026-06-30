---
layout: home
title: Foundatio Theme
description: A Lume theme for Foundatio technical sites
hero:
  name: Foundatio Theme
  text: Build docs and project sites with Lume
  tagline: VitePress-inspired docs, generated navigation, local search, Shiki code blocks, and room for richer site sections.
  image:
    src: https://raw.githubusercontent.com/FoundatioFx/Foundatio/main/media/foundatio-icon.png
    alt: Foundatio logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Components
      link: /guide/components
features:
  - icon: Docs
    title: Markdown-first docs
    details: Write pages as ordinary markdown while the theme generates navigation, outlines, search, and machine-readable mirrors.
  - icon: Code
    title: Shiki code blocks
    details: Highlighted code blocks, copy buttons, line handling, and search excerpts share the same rendering path.
  - icon: Site
    title: More than docs
    details: The theme is structured for project sites that can grow into guides, blogs, news, and custom pages.
homeSections:
  - title: Designed for Lume
    text: Use a standard Lume site with site.use(foundatio(...)) while the theme composes markdown, metadata, navigation, search, sitemap, and support outputs.
    links:
      - text: Read the guide
        link: /guide/getting-started
      - text: View the demo
        link: /guide/demo
  - title: Built-in outputs
    features:
      - title: Local search
        details: Search indexes page and section content without storing full rendered pages.
      - title: LLM files
        details: llms.txt and llms-full.txt are emitted from the same guide structure.
      - title: Markdown mirrors
        details: Public markdown mirrors are generated for docs pages.
---

## Built for technical project sites

Foundatio Theme is a shared presentation layer for projects that want polished documentation without giving up Lume's flexible build pipeline. Keep most content in markdown, let front matter drive navigation, and still have room for custom pages, release notes, blogs, or project-specific sections.

Use the [theme demo](/guide/demo) when changing styles or renderers. The home page stays product-facing while the demo page carries broad visual coverage.
