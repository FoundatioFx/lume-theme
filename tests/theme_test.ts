import { assert, assertStringIncludes } from "@std/assert";
import { fromFileUrl, join } from "@std/path";

const docsDir = fromFileUrl(new URL("../docs/", import.meta.url));
const siteDir = join(docsDir, "_site");
let built = false;

async function buildFixture() {
  if (built) {
    return;
  }

  try {
    await Deno.remove(siteDir, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  const command = new Deno.Command(Deno.execPath(), {
    args: ["task", "build"],
    cwd: docsDir,
    stdout: "piped",
    stderr: "piped",
  });
  const output = await command.output();

  if (!output.success) {
    const decoder = new TextDecoder();
    throw new Error(
      [
        "Dogfood docs build failed.",
        decoder.decode(output.stdout),
        decoder.decode(output.stderr),
      ].join("\n"),
    );
  }

  built = true;
}

async function readSiteText(path: string): Promise<string> {
  await buildFixture();
  return await Deno.readTextFile(join(siteDir, path));
}

async function assertSiteFile(path: string): Promise<void> {
  await buildFixture();
  const stat = await Deno.stat(join(siteDir, path));
  assert(stat.isFile, `${path} should be a file`);
}

Deno.test("dogfood docs render the home page through the theme", async () => {
  const html = await readSiteText("index.html");

  assertStringIncludes(html, "Foundatio Theme");
  assertStringIncludes(html, "VPHome");
  assertStringIncludes(html, "VPFeatures");
  assertStringIncludes(html, "Built for technical project sites");
  assertStringIncludes(html, 'href="/guide/getting-started/"');
  assertStringIncludes(html, "https://theme.foundatio.dev/");
  assert(!html.includes("Dogfood Coverage"));
});

Deno.test("dogfood docs render guide pages with sidebar, outline, and Shiki code", async () => {
  const html = await readSiteText("guide/getting-started/index.html");

  assertStringIncludes(html, "VPDoc");
  assertStringIncludes(html, "VPSidebar");
  assertStringIncludes(html, "VPDocAsideOutline");
  assertStringIncludes(html, "Install the package");
  assertStringIncludes(html, 'class="shiki');
  assertStringIncludes(html, "--shiki-light:#c62739");
  assertStringIncludes(html, 'title="Copy Code"');
  assertStringIncludes(html, 'class="tip custom-block"');
});
Deno.test("dogfood docs render VitePress-style custom containers without swallowing later sections", async () => {
  const html = await readSiteText("guide/components/index.html");
  const warningStart = html.indexOf('class="warning custom-block"');
  const warningEnd = html.indexOf("</div>", warningStart);
  const tablesHeading = html.indexOf('<h2 id="tables"');
  const detailsHeading = html.indexOf('<h2 id="details"');

  assert(warningStart >= 0, "warning callout should render");
  assert(warningEnd > warningStart, "warning callout should close");
  assert(
    tablesHeading > warningEnd,
    "tables section should be outside callout",
  );
  assert(
    detailsHeading > tablesHeading,
    "details section should follow tables",
  );

  const warningHtml = html.slice(warningStart, warningEnd);
  assertStringIncludes(warningHtml, "Callouts are useful");
  assertStringIncludes(warningHtml, "inside normal markdown content.");
  assert(
    !warningHtml.includes("Tables"),
    "callout should not contain later sections",
  );
});

Deno.test("dogfood docs render a dedicated demo page with broad markdown coverage", async () => {
  const html = await readSiteText("guide/demo/index.html");

  assertStringIncludes(html, "Theme Demo");
  assertStringIncludes(html, 'class="mermaid"');
  assertStringIncludes(html, 'class="VPBadge tip"');
  assertStringIncludes(html, 'class="info custom-block"');
  assertStringIncludes(html, 'class="tip custom-block"');
  assertStringIncludes(html, 'class="warning custom-block"');
  assertStringIncludes(html, 'class="danger custom-block"');
  assertStringIncludes(html, 'class="details custom-block"');
  assertStringIncludes(html, 'class="vp-code-group"');
  assertStringIncludes(html, 'class="tabs"');
  assertStringIncludes(html, 'type="radio"');
  assertStringIncludes(html, 'class="blocks"');
  assertStringIncludes(html, 'data-title="config.js"');
  assertStringIncludes(html, 'data-title="config.ts"');
  assertStringIncludes(html, 'data-title="theme.ts"');
  assertStringIncludes(html, 'class="line diff add"');
  assertStringIncludes(html, 'class="line highlighted" data-line-number="5"');
  assertStringIncludes(html, 'class="line highlighted warning"');
  assertStringIncludes(html, 'class="line has-focus"');
  assertStringIncludes(html, 'data-tab-title="theme.ts"');
  assertStringIncludes(html, 'data-tab-title="guide/page.md"');
  assertStringIncludes(html, 'data-tab-title="src/BuildSiteHandler.cs"');
  assertStringIncludes(html, 'data-tab-title="single.config.ts"');
  assert((html.match(/class="vp-code-group"/g)?.length ?? 0) >= 2);
  assertStringIncludes(html, "--shiki-dark:#818e99");
  assert((html.match(/line-numbers-mode/g)?.length ?? 0) >= 4);
  assert((html.match(/line-numbers-wrapper/g)?.length ?? 0) >= 4);
  assertStringIncludes(html, "Local search");
  assertStringIncludes(html, "Footer Navigation");
});

Deno.test("theme emits bundled browser assets", async () => {
  await assertSiteFile("assets/site.css");
  await assertSiteFile("assets/site.js");
  await assertSiteFile("assets/inter-roman-latin.woff2");

  const css = await readSiteText("assets/site.css");
  const js = await readSiteText("assets/site.js");
  assertStringIncludes(js, "mermaid.run");

  assertStringIncludes(css, ".VPNav");
  assertStringIncludes(
    css,
    '.vp-code-group .tabs label[data-title$=".js"]::before',
  );
  assertStringIncludes(
    css,
    '.vp-code-group .tabs label[data-title$=".ts"]::before',
  );
  assertStringIncludes(css, "%23007acc");
  const normalizedCss = css.replaceAll("\r\n", "\n");
  assertStringIncludes(
    normalizedCss,
    ".VPHomeSection .items {\n  display: flex;",
  );
  assertStringIncludes(
    normalizedCss,
    ".VPHomeSection .item {\n  padding: 8px;",
  );
  assertStringIncludes(
    normalizedCss,
    "  .VPHomeSection .item {\n    width: 33.333333%;",
  );
});

Deno.test("theme emits support outputs for search, llms, markdown mirrors, and legacy redirects", async () => {
  await assertSiteFile("search-index.json");
  await assertSiteFile("llms.txt");
  await assertSiteFile("llms-full.txt");
  await assertSiteFile("guide/getting-started.md");
  await assertSiteFile("guide/demo/index.html");
  await assertSiteFile("guide/getting-started.html");
  await assertSiteFile("sitemap.xml");
  await assertSiteFile("CNAME");

  const cname = await readSiteText("CNAME");
  assertStringIncludes(cname, "theme.foundatio.dev");

  const search = JSON.parse(await readSiteText("search-index.json"));
  assert(Array.isArray(search));
  assert(
    search.some((entry: { title?: string }) =>
      entry.title === "Getting Started"
    ),
  );

  const redirect = await readSiteText("guide/getting-started.html");
  assertStringIncludes(redirect, "url=/guide/getting-started/");
});

Deno.test("markdown mirrors strip authoring front matter", async () => {
  const markdown = await readSiteText("guide/getting-started.md");
  const generatedFrontMatter = markdown.slice(
    0,
    markdown.indexOf("# Getting Started"),
  );

  assertStringIncludes(generatedFrontMatter, "url: /guide/getting-started.md");
  assertStringIncludes(markdown, "# Getting Started");
  assert(
    !generatedFrontMatter.includes("sectionOrder"),
    "markdown mirrors should not expose authoring navigation metadata",
  );
  assert(
    !generatedFrontMatter.includes("nav:"),
    "markdown mirrors should not expose authoring navigation metadata",
  );
});
