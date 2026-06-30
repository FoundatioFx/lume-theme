export type ThemePlugin = (site: ThemeSite) => void | Promise<void>;
export type LumePluginFactory<TOptions = unknown> = (
  options?: TOptions,
) => ThemePlugin;

export type GeneratedPageData = {
  url: string;
  content?: string | Uint8Array;
  unlisted?: boolean;
  search?: boolean;
  [key: string]: unknown;
};

export type ThemePageData = Record<string, unknown> & {
  url?: string;
  page?: ThemePage;
};

export type ThemePage = {
  src: {
    path?: string;
    ext?: string;
    entry?: {
      src: string;
      path?: string;
    };
  };
  data: ThemePageData;
  sourcePath: string;
  isHTML: boolean;
  content?: string | Uint8Array;
  text: string;
  document: Document;
};

export type ThemeSite = {
  ignore(...paths: string[]): ThemeSite;
  use(plugin: unknown): ThemeSite;
  add(path: string, to?: string): ThemeSite;
  remoteFile(path: string, url: string): ThemeSite;
  copy(from: string, to?: string): ThemeSite;
  preprocess(
    extensions: string[],
    processor: (pages: ThemePage[]) => void | Promise<void>,
  ): ThemeSite;
  process(
    extensions: string[],
    processor: (
      pages: ThemePage[],
      allPages: ThemePage[],
    ) => void | Promise<void>,
  ): ThemeSite;
};

export type FoundatioLumeOptions = {
  markdown: LumePluginFactory;
  metas: LumePluginFactory;
  sitemap: LumePluginFactory;
  checkUrls: LumePluginFactory;
  basePath: LumePluginFactory;
};

export function createGeneratedPage(
  pages: ThemePage[],
  data: GeneratedPageData,
): ThemePage {
  const PageConstructor = pages[0]?.constructor as
    | { create?: (data: GeneratedPageData) => ThemePage }
    | undefined;

  const create = PageConstructor?.create;
  if (!create) {
    throw new Error(
      "Unable to create generated Lume page because no page factory was available.",
    );
  }

  return create(data);
}
