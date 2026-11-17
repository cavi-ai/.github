import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

import { renderModels, renderProducts, renderProfile } from "../scripts/render-profile.mjs";

const readme = await readFile(new URL("../profile/README.md", import.meta.url), "utf8");
const catalog = JSON.parse(await readFile(new URL("../catalog/site-catalog.json", import.meta.url), "utf8"));

const productRow = (name) => readme.split("\n").find((line) => line.startsWith(`| [**${name}**](`));
const section = (heading) => readme.split(/\n(?=#{2,3} )/).find((part) => part.startsWith(heading));
const featured = ["bobby-browser", "companion-for-claude"];

test("presents CAVI-AI with its positioning and canonical links", () => {
  for (const marker of [
    "https://cavi-ai.xyz",
    "Open research",
    "MIT",
    "More work is in development",
  ]) assert.ok(readme.includes(marker), `missing ${marker}`);
});

test("names what the organization ships above the badges", () => {
  const hero = readme.slice(readme.indexOf("</h2>"), readme.indexOf("<a href"));
  for (const term of ["MCP servers", "Claude", "Obsidian", "browser automation", "MLX"])
    assert.ok(hero.includes(term), `hero missing ${term}`);
});

test("the product and model tables are rendered from the site catalog", () => {
  assert.equal(renderProfile(readme, catalog), readme, "run node scripts/render-profile.mjs");
});

test("lists every catalog product once: featured ones under Start here, the rest by category", () => {
  const start = readme.indexOf("## Start here");
  const stack = readme.indexOf("## Explore the stack");
  assert.ok(start !== -1 && start < stack, "Start here must precede the stack");
  const startHere = readme.slice(start, stack);
  assert.deepEqual(
    [...startHere.matchAll(/^### (.+)$/gm)].map(([, name]) => name),
    ["Companion for Claude", "Bobby Browser"],
  );
  for (const product of catalog.products) {
    const link = `[**${product.name}**](${product.repository})`;
    const rows = readme.split("\n").filter((line) => line.startsWith(`| ${link}`));
    if (featured.includes(product.slug)) {
      assert.equal(rows.length, 0, `${product.name} is featured, not listed in a table`);
      assert.ok(startHere.includes(`[**${product.name}**]`), `${product.name} lives under Start here`);
    } else {
      assert.equal(rows.length, 1, `${product.name} must appear in exactly one table row`);
    }
  }
  const groups = catalog.categories.filter((category) =>
    catalog.products.some((product) => product.category === category.slug && !featured.includes(product.slug)));
  assert.deepEqual(
    [...readme.slice(stack).matchAll(/^### (.+)$/gm)].map(([, heading]) => heading),
    groups.map((category) => category.label),
  );
});

test("renders a category table with status, summary and install guide", () => {
  const rendered = renderProducts({
    categories: [{ slug: "creative-apps", label: "Creative apps" }, { slug: "empty", label: "Empty" }],
    products: [
      { slug: "a", name: "A MCP", category: "creative-apps", status: "Preview", summary: "Cuts | clips.", install: "uv tool install a", repository: "https://github.com/cavi-ai/a", page: "https://cavi-ai.xyz/products/a/" },
      { slug: "b", name: "B App", category: "creative-apps", status: null, summary: "Shows b.", install: null, repository: "https://github.com/cavi-ai/b", page: "https://cavi-ai.xyz/products/b/" },
      { slug: "c", name: "C Featured", category: "creative-apps", status: null, summary: "Featured.", install: null, repository: "https://github.com/cavi-ai/c", page: "https://cavi-ai.xyz/products/c/" },
    ],
  }, new Set(["c"]));
  assert.equal(rendered, [
    "### Creative apps",
    "",
    "| Project | What it does | Install |",
    "| :-- | :-- | :-- |",
    "| [**A MCP**](https://github.com/cavi-ai/a) | Preview. Cuts \\| clips. | `uv tool install a` · [Install guide](https://cavi-ai.xyz/products/a/) |",
    "| [**B App**](https://github.com/cavi-ai/b) | Shows b. | [Install guide](https://cavi-ai.xyz/products/b/) |",
    "",
  ].join("\n"));
});

test("renders each model with its task, format, scope, base model and download command", () => {
  const rendered = renderModels({
    models: [
      { id: "cavi-ai/m-MLX-4bit", href: "https://huggingface.co/cavi-ai/m-MLX-4bit", task: "Speech recognition", format: "MLX 4-bit", scope: "Streaming · English", base: { name: "org/m", href: "https://huggingface.co/org/m" }, install: "hf download cavi-ai/m-MLX-4bit" },
      { id: "cavi-ai/d", href: "https://huggingface.co/cavi-ai/d", task: "Object detection", format: "ONNX", scope: null, base: null, install: "hf download cavi-ai/d" },
    ],
  });
  assert.equal(rendered, [
    "| Model | What it does | Download |",
    "| :-- | :-- | :-- |",
    "| [`cavi-ai/m-MLX-4bit`](https://huggingface.co/cavi-ai/m-MLX-4bit) | Speech recognition. MLX 4-bit. Streaming · English. Base model [`org/m`](https://huggingface.co/org/m). | `hf download cavi-ai/m-MLX-4bit` |",
    "| [`cavi-ai/d`](https://huggingface.co/cavi-ai/d) | Object detection. ONNX. | `hf download cavi-ai/d` |",
    "",
  ].join("\n"));
});

test("refuses a README without catalog blocks or a catalog of another schema", () => {
  assert.throws(() => renderProfile("# Profile\n", catalog), /no catalog:products block/);
  assert.throws(() => renderProfile(readme, { ...catalog, schema: 2 }), /Unsupported catalog schema 2/);
});

test("names every product in title case", () => {
  const titleCase = (name) => name.split(" ").every((word) => word === "for" || /^[A-Z]/.test(word));
  for (const [, name] of readme.matchAll(/^\| \[\*\*([^*]+)\*\*\]/gm))
    assert.ok(titleCase(name), `product name "${name}" is not title case`);
  for (const [, name] of readme.matchAll(/^### (.+)$/gm))
    if (readme.includes(`[**${name}**]`)) assert.ok(titleCase(name), `flagship "${name}" is not title case`);
});

test("selects a dedicated profile banner for each GitHub color scheme", async () => {
  assert.match(
    readme,
    /<source media="\(prefers-color-scheme: dark\)" srcset="\.\/banner-dark\.png">/,
  );
  assert.match(
    readme,
    /<source media="\(prefers-color-scheme: light\)" srcset="\.\/banner-light\.png">/,
  );
  assert.match(
    readme,
    /<img src="\.\/banner-light\.png" alt="CAVI-AI — open research and infrastructure for agent systems">/,
  );

  for (const asset of ["banner-dark.png", "banner-light.png"]) {
    const metadata = await stat(new URL(`../profile/${asset}`, import.meta.url));
    assert.ok(metadata.size > 0, `${asset} must not be empty`);
  }
});

test("describes the featured products accurately", () => {
  assert.match(section("### Bobby Browser"), /\balpha\b/i);
  assert.match(
    readme,
    /Obsidian Community Store release for Claude knowledge workflows/,
  );
  assert.ok(section("### Companion for Claude").includes("https://obsidian.md/plugins?id=claude-companion"));
  assert.ok(section("### Bobby Browser").includes("brew install cavi-ai/tap/bobby-browser"));
  assert.doesNotMatch(readme, /firewall|correlates/i);
});

test("marks products without a published release as Preview", () => {
  for (const product of catalog.products.filter((entry) => !featured.includes(entry.slug))) {
    const summary = productRow(product.name).split(" | ")[1];
    if (product.status === "Preview") assert.match(summary, /^Preview\./, `${product.name} is marked Preview`);
    else assert.doesNotMatch(summary, /^Preview\./, `${product.name} has a release and is not Preview`);
  }
});

test("shows real product screenshots from each product's own repository", () => {
  for (const src of [
    "https://raw.githubusercontent.com/cavi-ai/companion-for-claude/main/assets/canvas-output.png",
    "https://raw.githubusercontent.com/cavi-ai/secure-agent/main/assets/screenshots/overview-dark.jpg",
    "https://raw.githubusercontent.com/cavi-ai/mlx-workbench/main/docs/images/library.png",
  ]) assert.ok(readme.includes(`src="${src}"`), `missing screenshot ${src}`);
  for (const img of readme.match(/<img\b[^>]*>/g))
    assert.match(img, /\balt="[^"]+"/, `image without alt text: ${img}`);
});

test("shows only badges backed by live data or real destinations", () => {
  const badges = readme.slice(readme.indexOf("</h2>"), readme.indexOf("## Start here"));
  for (const marker of [
    "metrics/release-downloads.json",
    "GitHub release asset downloads",
    "https://github.com/cavi-ai/homebrew-tap",
    "https://cavi-ai.xyz/docs",
  ]) assert.ok(badges.includes(marker), `missing badge marker ${marker}`);
  // The organization has no social accounts yet.
  assert.doesNotMatch(readme, /discord\.|x\.com\/|twitter\.com\/|linkedin\.com\//i);
});

test("lists every Hugging Face model with its download command", () => {
  const models = section("## Models on Hugging Face");
  assert.ok(models, "missing Models on Hugging Face section");
  assert.ok(readme.indexOf("## Models on Hugging Face") < readme.indexOf("## Built in the open"));
  assert.ok(models.includes("https://huggingface.co/cavi-ai"), "links the organization");
  assert.ok(catalog.models.length > 0);
  for (const { id } of catalog.models) {
    const row = models.split("\n").find((line) => line.startsWith(`| [\`${id}\`](https://huggingface.co/${id})`));
    assert.ok(row, `missing model row ${id}`);
    assert.ok(row.includes(`\`hf download ${id}\``), `${id} row missing its download command`);
  }
  assert.ok(
    readme.slice(readme.indexOf("</h2>"), readme.indexOf("## Start here")).includes("https://huggingface.co/cavi-ai"),
    "Hugging Face badge links the organization",
  );
});

test("links every in-page anchor to a heading", () => {
  const slug = (heading) => heading.toLowerCase().replace(/[^\w\s-]/gu, "").trim().replace(/\s/gu, "-");
  const anchors = new Set([...readme.matchAll(/^#{2,3} (.+)$/gm)].map(([, heading]) => slug(heading)));
  for (const [, anchor] of readme.matchAll(/href="#([^"]+)"/g))
    assert.ok(anchors.has(anchor), `#${anchor} has no heading`);
});

test("makes only claims every listed project meets", () => {
  // Not every published package carries a provenance attestation.
  assert.doesNotMatch(readme, /provenance/i);
  // After Effects has its own server; Adobe MCP does not cover it.
  assert.doesNotMatch(productRow("Adobe MCP"), /After Effects/);
  assert.doesNotMatch(readme, /synthetic|field validity alone/i);
  assert.doesNotMatch(readme, /^## Research and verification/m);
});

test("keeps the public profile scoped, stable, and version-free", () => {
  // No pinned version numbers: the profile must not rot as releases move.
  assert.doesNotMatch(readme, /\bv?\d+\.\d+\.\d+\b/);
  assert.doesNotMatch(readme, /latest releases?/i);
  assert.doesNotMatch(readme, /canonical runtime contract/i);
  assert.doesNotMatch(readme, /cavi-ai\/claude-obsidian(?:-plugin)?/i);
  for (const privateName of [
    "cavi-control-ui", "ecg", "cc-hermes", "cavi-fleet-router",
    "game-art-pipeline", "houdini-mcp", "repo-audit",
  ])
    assert.ok(!readme.includes(privateName), `must not expose ${privateName}`);
});
