import type { ThemePage } from "./lume.ts";
import { createHighlighter } from "shiki";
import type { ResolvedFoundatioThemeOptions } from "./types.ts";

let highlighterPromise: ReturnType<typeof createHighlighter> | undefined;

export async function highlightCodeBlocks(
  pages: ThemePage[],
  theme: ResolvedFoundatioThemeOptions,
) {
  if (!theme.codeHighlight) {
    return;
  }

  const highlighter = await getHighlighter(theme);
  for (const page of pages) {
    for (
      const wrapper of page.document.querySelectorAll<HTMLElement>(
        "div[class*='language-']",
      )
    ) {
      const pre = wrapper.querySelector<HTMLElement>("pre");
      const code = wrapper.querySelector<HTMLElement>("pre > code");
      if (!pre || !code) {
        continue;
      }

      const language = shikiLanguage(wrapper.className, theme);
      const source = (code.textContent ?? "").replace(/\n$/, "");
      const highlighted = highlighter.codeToHtml(source, {
        lang: language,
        themes: theme.codeHighlight.themes,
        defaultColor: false,
      });

      pre.outerHTML = normalizeVitePressShikiColors(highlighted);
    }
  }
}

function normalizeVitePressShikiColors(html: string) {
  return html
    .replaceAll("--shiki-light:#D73A49", "--shiki-light:#c62739")
    .replaceAll("--shiki-light:#6A737D", "--shiki-light:#62687b")
    .replaceAll("--shiki-dark:#6A737D", "--shiki-dark:#818e99");
}

export function applyCodeLineAnnotations(page: ThemePage) {
  for (
    const wrapper of page.document.querySelectorAll<HTMLElement>(
      "div[class*='language-']",
    )
  ) {
    const code = wrapper.querySelector<HTMLElement>("pre > code");
    const pre = wrapper.querySelector<HTMLElement>("pre");
    if (!code || !pre) {
      continue;
    }

    const metadata = parseLineMetadata(
      wrapper.getAttribute("data-line-meta") ?? "",
    );
    const lineNumbers = wrapper.getAttribute("data-line-numbers") ===
      "true";
    const lineNumberStart = Math.max(
      1,
      Number(wrapper.getAttribute("data-line-number-start") ?? 1),
    );
    const shikiLines = [...code.querySelectorAll<HTMLElement>(".line")];
    const lineCount = shikiLines.length ||
      code.innerHTML.split("\n").length;
    const hasFocusedLines = [...metadata.values()].some((classes) =>
      classes.includes("has-focus")
    );

    if (shikiLines.length > 0) {
      shikiLines.forEach((line, index) => {
        applyLineMetadata(
          line,
          index + 1,
          lineNumberStart + index,
          metadata,
        );
      });
      code.innerHTML = shikiLines.map((line) => line.outerHTML).join("\n");
    } else {
      const original = code.innerHTML.replace(/\n$/, "");
      code.innerHTML = original.split("\n").map((line, index) => {
        const sourceLineNumber = index + 1;
        const displayLineNumber = lineNumberStart + index;
        const classes = [
          "line",
          ...(metadata.get(sourceLineNumber) ?? []),
        ].join(" ");
        return `<span class="${classes}" data-line-number="${displayLineNumber}">${
          line || "\u200b"
        }</span>`;
      }).join("\n");
    }

    wrapper.classList.add("has-lines");
    if (hasFocusedLines) {
      pre.classList.add("has-focused-lines");
    }

    if (lineNumbers) {
      wrapper.classList.add("line-numbers-mode");
      if (!wrapper.querySelector(".line-numbers-wrapper")) {
        const lineNumbersWrapper = page.document.createElement("div");
        lineNumbersWrapper.className = "line-numbers-wrapper";
        lineNumbersWrapper.setAttribute("aria-hidden", "true");
        lineNumbersWrapper.innerHTML = lineNumbersHtml(
          lineCount,
          lineNumberStart,
        );
        wrapper.appendChild(lineNumbersWrapper);
      }
    }

    wrapper.removeAttribute("data-line-meta");
    wrapper.removeAttribute("data-line-numbers");
    wrapper.removeAttribute("data-line-number-start");
  }

  initializeCodeGroups(page);
}

function getHighlighter(theme: ResolvedFoundatioThemeOptions) {
  if (!theme.codeHighlight) {
    throw new Error("Code highlighting is disabled.");
  }

  highlighterPromise ??= createHighlighter({
    themes: [
      theme.codeHighlight.themes.light,
      theme.codeHighlight.themes.dark,
    ],
    langs: theme.codeHighlight.langs,
  });

  return highlighterPromise;
}

function shikiLanguage(
  className: string,
  theme: ResolvedFoundatioThemeOptions,
): string {
  if (!theme.codeHighlight) {
    return "text";
  }

  const raw = /language-([\w-]+)/.exec(className)?.[1]?.toLowerCase() ??
    "text";
  const normalized = languageAliases[raw] ?? raw;
  return theme.codeHighlight.langs.includes(normalized) ? normalized : "text";
}

function applyLineMetadata(
  line: HTMLElement,
  sourceLineNumber: number,
  displayLineNumber: number,
  metadata: Map<number, string[]>,
) {
  line.setAttribute("data-line-number", String(displayLineNumber));

  const classes = metadata.get(sourceLineNumber) ?? [];
  if (classes.length > 0) {
    line.classList.add(...classes);
  }

  if (line.innerHTML === "") {
    line.innerHTML = "\u200b";
  }
}

function parseLineMetadata(value: string) {
  const result = new Map<number, string[]>();
  for (const item of value.split(";")) {
    if (!item.trim()) {
      continue;
    }

    const [lineValue, classValue = ""] = item.split(":", 2);
    const line = Number(lineValue);
    const classes = classValue.split(",").map((part) => part.trim())
      .filter(Boolean);
    if (Number.isFinite(line) && classes.length > 0) {
      result.set(line, classes);
    }
  }

  return result;
}

function lineNumbersHtml(count: number, start: number) {
  return Array.from(
    { length: count },
    (_value, index) => `<span class="line-number">${start + index}</span><br>`,
  ).join("");
}

function initializeCodeGroups(page: ThemePage) {
  let groupIndex = 0;

  for (
    const group of page.document.querySelectorAll<HTMLElement>(
      ".vp-code-group",
    )
  ) {
    const children = [...group.children];
    if (
      children.some((child) =>
        child.classList.contains("tabs") || child.classList.contains("blocks")
      )
    ) {
      continue;
    }

    const blocks = children.filter((
      child,
    ): child is HTMLElement =>
      child.matches("div[class^='language-'], div[class*=' language-']")
    );

    if (blocks.length === 0) {
      continue;
    }

    const tabs = page.document.createElement("div");
    tabs.className = "tabs";
    const blocksWrapper = page.document.createElement("div");
    blocksWrapper.className = "blocks";
    const groupName = `code-group-${groupIndex++}`;

    blocks.forEach((block, index) => {
      const title = block.getAttribute("data-title");
      const tabTitle = title || block.querySelector(".lang")?.textContent ||
        `Example ${index + 1}`;
      block.setAttribute("data-tab-title", tabTitle);
      block.removeAttribute("data-title");

      const active = index === 0;
      block.classList.toggle("active", active);
      if (active) {
        block.removeAttribute("hidden");
      } else {
        block.setAttribute("hidden", "");
      }

      const input = page.document.createElement("input");
      const id = `${groupName}-${index}`;
      input.setAttribute("type", "radio");
      input.setAttribute("name", groupName);
      input.setAttribute("id", id);
      if (active) {
        input.setAttribute("checked", "");
      }

      const label = page.document.createElement("label");
      label.setAttribute("data-title", tabTitle);
      label.setAttribute("for", id);
      label.textContent = tabTitle;

      tabs.appendChild(input);
      tabs.appendChild(label);
      blocksWrapper.appendChild(block);
    });

    group.insertBefore(tabs, group.firstChild);
    group.appendChild(blocksWrapper);
  }
}

const languageAliases: Record<string, string> = {
  bash: "shellscript",
  c: "csharp",
  cs: "csharp",
  javascript: "javascript",
  js: "javascript",
  md: "markdown",
  ps1: "powershell",
  pwsh: "powershell",
  sh: "shellscript",
  shell: "shellscript",
  text: "text",
  ts: "typescript",
  txt: "text",
  xml: "xml",
  yaml: "yaml",
  yml: "yaml",
  zsh: "shellscript",
};
