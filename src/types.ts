import type { FoundatioLumeOptions, ThemePage } from "./lume.ts";

type PluginOptions = Record<string, unknown>;
type MetaData = Record<string, unknown>;
type SitemapOptions = PluginOptions;
type CheckUrlsOptions = PluginOptions;
export type FoundatioThemeOptions = {
  title: string;
  description: string;
  location?: string | URL;
  basePath?: string;
  docsRoot?: string;
  lume: FoundatioLumeOptions;
  head?: HeadEntry[];
  metas?: MetaData;
  labels?: Partial<ThemeLabels>;
  brand?: {
    label?: string;
    logoLight?: string;
    logoDark?: string;
    icon?: string;
    themeColor?: string;
  };
  nav?: NavLink[];
  social?: SocialLink[];
  footer?: {
    message?: string;
    copyright?: string;
  };
  editLink?: {
    pattern: string;
    text?: string;
  };
  lastUpdated?: boolean | LastUpdatedOptions;
  outline?: OutlineOptions;
  sitemap?: boolean | SitemapOptions;
  checkUrls?: boolean | CheckUrlsOptions;
  codeHighlight?: false | CodeHighlightOptions;
  code?: {
    lineNumbers?: boolean;
  };
  snippets?: false | SnippetOptions;
  redirects?: Record<string, string>;
  llms?: boolean;
  markdownMirrors?: boolean;
  search?: boolean;
  assets?: boolean | { baseUrl?: string | URL };
  rawPagesDir?: string | false;
  ignore?: string[];
};

export type ResolvedFoundatioThemeOptions =
  & Required<
    Pick<FoundatioThemeOptions, "title" | "description" | "docsRoot" | "lume">
  >
  & {
    location?: URL;
    basePath: string;
    head: HeadEntry[];
    metas: MetaData;
    labels: ThemeLabels;
    brand: Required<NonNullable<FoundatioThemeOptions["brand"]>>;
    nav: NavLink[];
    social: SocialLink[];
    footer: Required<NonNullable<FoundatioThemeOptions["footer"]>>;
    editLink?: Required<NonNullable<FoundatioThemeOptions["editLink"]>>;
    lastUpdated: false | Required<LastUpdatedOptions>;
    outline: Required<OutlineOptions>;
    sitemap: false | SitemapOptions;
    checkUrls: false | CheckUrlsOptions;
    codeHighlight: false | {
      themes: { light: string; dark: string };
      langs: string[];
    };
    code: Required<NonNullable<FoundatioThemeOptions["code"]>>;
    snippets: false | Required<SnippetOptions>;
    redirects: Record<string, string>;
    llms: boolean;
    markdownMirrors: boolean;
    search: boolean;
    assets: boolean;
    assetBaseUrl: URL;
    rawPagesDir: string | false;
    ignore: string[];
  };

export type NavLink = {
  text: string;
  link?: string;
  items?: NavLink[];
  activeMatch?: string;
  target?: string;
  rel?: string;
  external?: boolean;
  noIcon?: boolean;
};

export type SocialLink = {
  label: string;
  link: string;
  text?: string;
  icon?: string;
  class?: string;
};

export type Heading = {
  level: number;
  text: string;
  slug: string;
};

export type Badge = {
  text: string;
  type?: "info" | "tip" | "warning" | "danger" | string;
};

export type NavMeta = {
  title?: string;
  section?: string;
  sectionOrder?: number;
  order?: number;
  hidden?: boolean;
  collapsed?: boolean;
  badge?: string | Badge;
};

export type Feature = {
  icon?: string;
  title: string;
  details: string;
  link?: string;
  linkText?: string;
};

export type HomeSection = {
  title?: string;
  text?: string;
  links?: Action[];
  features?: Feature[];
};

export type PageLink = string | {
  text?: string;
  link?: string;
};

export type DocFooterOptions = {
  editLink?: boolean;
  lastUpdated?: boolean;
  prev?: false | PageLink;
  next?: false | PageLink;
};

export type Action = {
  theme?: string;
  text: string;
  link: string;
};

export type DocsData = {
  url: string;
  title?: string;
  description?: string;
  lang?: string;
  image?: string;
  head?: HeadEntry[];
  metas?: MetaData;
  canonical?: string | false;
  navbar?: boolean;
  sidebar?: boolean;
  aside?: boolean;
  footer?: boolean;
  docFooter?: false | DocFooterOptions;
  editLink?: boolean;
  lastUpdated?: boolean;
  outline?: false | OutlineLevel | OutlineOptions;
  pageClass?: string;
  unlisted?: boolean;
  date?: Date | string;
  lastmod?: Date | string;
  lastUpdatedDate?: Date;
  nav?: NavMeta;
  headings?: Heading[];
  layout?: string | false;
  theme?: "home" | "docs" | "page" | false;
  docsLayout?: "home" | "docs" | "page" | false;
  search?: boolean;
  hero?: {
    name?: string;
    text?: string;
    tagline?: string;
    image?: {
      src: string;
      alt?: string;
    };
    actions?: Action[];
  };
  features?: Feature[];
  homeSections?: HomeSection[];
  prev?: false | PageLink;
  next?: false | PageLink;
  page?: ThemePage;
};

export type SidebarPage = {
  title: string;
  url?: string;
  sourcePath?: string;
  section: string;
  sectionOrder: number;
  order: number;
  level: number;
  collapsed: boolean;
  badge?: Badge;
  children: SidebarPage[];
};

export type SidebarSection = {
  title: string;
  order: number;
  items: SidebarPage[];
};

export type ContentEntry = {
  page: ThemePage;
  data: DocsData;
  sourcePath: string;
  html: string;
  markdown: string;
};

export type OutlineLevel = number | [number, number];

export type OutlineOptions = {
  level?: OutlineLevel;
  label?: string;
};

export type LastUpdatedOptions = {
  git?: boolean;
  text?: string;
};

export type SnippetOptions = {
  docsRoot?: string;
  repoRoot?: string;
  aliases?: Record<string, string>;
};

export type CodeHighlightOptions = {
  themes?: {
    light?: string;
    dark?: string;
  };
  langs?: string[];
};

export type ThemeLabels = {
  search: string;
  searchPlaceholder: string;
  searchNoResults: string;
  searchRecent: string;
  searchClose: string;
  menu: string;
  returnTop: string;
  outline: string;
  editLink: string;
  lastUpdated: string;
  previousPage: string;
  nextPage: string;
  notFoundTitle: string;
  notFoundMessage: string;
  notFoundLink: string;
};

export type HeadEntry =
  | string
  | [tag: string, attrs?: HeadAttrs, content?: string];

export type HeadAttrs = Record<
  string,
  string | number | boolean | undefined
>;
