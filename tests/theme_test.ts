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
  assertStringIncludes(html, 'href="/guide/getting-started/"');
  assertStringIncludes(html, "https://theme.foundatio.dev/");
});

Deno.test("dogfood docs render guide pages with sidebar, outline, and Shiki code", async () => {
  const html = await readSiteText("guide/getting-started/index.html");

  assertStringIncludes(html, "VPDoc");
  assertStringIncludes(html, "VPSidebar");
  assertStringIncludes(html, "VPDocAsideOutline");
  assertStringIncludes(html, "Install the package");
  assertStringIncludes(html, 'class="shiki');
  assertStringIncludes(html, 'title="Copy Code"');
  assertStringIncludes(html, 'class="tip custom-block"');
});

Deno.test("theme emits bundled browser assets", async () => {
  await assertSiteFile("assets/site.css");
  await assertSiteFile("assets/site.js");
  await assertSiteFile("assets/inter-roman-latin.woff2");

  const css = await readSiteText("assets/site.css");
  assertStringIncludes(css, ".VPNav");
});

Deno.test("theme emits support outputs for search, llms, markdown mirrors, and legacy redirects", async () => {
  await assertSiteFile("search-index.json");
  await assertSiteFile("llms.txt");
  await assertSiteFile("llms-full.txt");
  await assertSiteFile("guide/getting-started.md");
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
