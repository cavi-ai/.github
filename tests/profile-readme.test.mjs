import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

import { renderModels, renderProducts, renderProfile } from "../scripts/render-profile.mjs";

const readme = await readFile(new URL("../profile/README.md", import.meta.url), "utf8");
const catalog = JSON.parse(await readFile(new URL("../catalog/site-catalog.json", import.meta.url), "utf8"));

const productRow = (name) => readme.split("\n").find((line) => line.startsWith(`| [**${name}**](`));
const block = (name) => readme.split(`<!-- catalog:${name}`)[1]?.split(`<!-- /catalog:${name} -->`)[0];

test("links the public resources near the top", () => {
  const intro = readme.split("## ")[0];
  for (const url of ["https://cavi-ai.xyz/docs", "https://huggingface.co/cavi-ai", "https://github.com/cavi-ai/homebrew-tap", "https://github.com/cavi-ai?tab=repositories"]) {
    assert.ok(intro.includes(`href="${url}"`), `missing resource ${url}`);
  }
});

test("the product and model tables are rendered from the site catalog", () => {
  assert.equal(renderProfile(readme, catalog), readme, "run node scripts/render-profile.mjs");
});

test("lists every catalog product once in generated rows", () => {
  const products = block("products");
  assert.ok(products);
  for (const product of catalog.products) {
    const rows = products.split("\n").filter((line) => line.startsWith(`| [**${product.name}**](${product.repository})`));
    assert.equal(rows.length, 1, `${product.name} must appear in exactly one row`);
  }
  assert.equal((products.match(/^\| \[\*\*/gm) ?? []).length, catalog.products.length);
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

test("shows a nonempty local illustration with alt text", async () => {
  const image = readme.match(/<img\b[^>]*src="(\.\/[^" ]+)"[^>]*>/);
  assert.ok(image, "missing local illustration");
  assert.match(image[0], /\balt="[^" ](?:[^"]*[^" ])?"/);
  const metadata = await stat(new URL(`../profile/${image[1]}`, import.meta.url));
  assert.ok(metadata.isFile() && metadata.size > 0, "illustration must be a nonempty regular file");
  for (const img of readme.match(/<img\b[^>]*>/g) ?? [])
    assert.match(img, /\balt="[^"]+"/, `image without alt text: ${img}`);
});

test("marks products without a published release as Preview", () => {
  for (const product of catalog.products) {
    const summary = productRow(product.name).split(" | ")[1];
    if (product.status === "Preview") assert.match(summary, /^Preview\./, `${product.name} is marked Preview`);
    else assert.doesNotMatch(summary, /^Preview\./, `${product.name} has a release and is not Preview`);
  }
});

test("links the live release download count and update time to their snapshot", () => {
  const snapshot = "https://github.com/cavi-ai/.github/blob/main/metrics/release-downloads.json";
  const source = "https://raw.githubusercontent.com/cavi-ai/.github/main/metrics/release-downloads.json";
  const badgesByQuery = [...readme.matchAll(/<a href="([^"]+)"[^>]*><img src="([^"]+)"[^>]*><\/a>/g)]
    .filter(([, href]) => href === snapshot)
    .map(([, , src]) => {
      const url = new URL(src.replaceAll("&amp;", "&"));
      assert.equal(url.searchParams.get("url"), source);
      assert.equal(url.origin + url.pathname, "https://img.shields.io/badge/dynamic/json");
      return [url.searchParams.get("query"), url.searchParams.get("color")];
    });
  assert.deepEqual(badgesByQuery, [["$.total", "238636"], ["$.asOfDisplay", "57606a"]]);
});

test("lists every Hugging Face model with its download command", () => {
  const models = block("models");
  assert.ok(models);
  assert.ok(catalog.models.length > 0);
  for (const { id, href, install } of catalog.models) {
    const rows = models.split("\n").filter((line) => line.startsWith(`| [\`${id}\`](${href})`));
    assert.equal(rows.length, 1, `expected one model row for ${id}`);
    assert.ok(rows[0].includes(`\`${install}\``), `${id} row missing its download command`);
  }
  assert.equal((models.match(/^\| \[`/gm) ?? []).length, catalog.models.length);
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
  for (const privateName of [
    "cavi-control-ui", "ecg", "cc-hermes", "cavi-fleet-router",
    "game-art-pipeline", "houdini-mcp", "repo-audit",
  ])
    assert.ok(!readme.includes(privateName), `must not expose ${privateName}`);
});
