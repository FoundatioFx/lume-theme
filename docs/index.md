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
    text: The fixture uses a standard Lume config with site.use(foundatio(...)) so the theme is tested the same way consuming projects use it.
    links:
      - text: Read the guide
        link: /guide/getting-started
  - title: Built-in outputs
    features:
      - title: Local search
        details: Search indexes page and section content without storing full rendered pages.
      - title: LLM files
        details: llms.txt and llms-full.txt are emitted from the same guide structure.
      - title: Markdown mirrors
        details: Public markdown mirrors are generated for docs pages.
---

## Dogfood Coverage

This page exists so the theme repository can exercise home rendering, base-path URL rewriting, generated assets, and search metadata in one small fixture.

