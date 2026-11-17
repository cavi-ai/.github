import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { renderProducts, renderProfile } from "../scripts/render-profile.mjs";

const readme = await readFile(new URL("../profile/README.md", import.meta.url), "utf8");
const catalog = JSON.parse(await readFile(new URL("../catalog/site-catalog.json", import.meta.url), "utf8"));
const curation = JSON.parse(await readFile(new URL("../profile/product-curation.json", import.meta.url), "utf8"));

test("renders the current profile idempotently with each catalog product once", () => {
  assert.equal(renderProfile(readme, catalog, curation), readme);
  for (const product of catalog.products) {
    const link = `href="${product.repository}"`;
    // Art cards use one link for the image and another for the repository.
    const count = readme.split(link).length - 1;
    assert.equal(count, curation[product.slug]?.image ? 2 : 1, product.slug);
  }
  assert.ok(readme.indexOf("https://github.com/cavi-ai/openclaw-antigravity") > readme.indexOf("https://github.com/cavi-ai/loop-killer"));
});

test("escapes card text and rejects unsafe image and destination URLs", () => {
  const fixture = { categories: [{ slug: "x", label: "X" }], products: [{ slug: "a", category: "x", name: "A < B", summary: 'Use "tools" & more', repository: "https://example.org/a", page: "https://example.org/setup" }] };
  const html = renderProducts(fixture, { a: { description: 'A & <B>', image: "https://example.org/a.png", alt: 'A "picture"' } });
  assert.match(html, /A &amp; &lt;B&gt;/);
  assert.match(html, /A &quot;picture&quot;/);
  assert.throws(() => renderProducts(fixture, { a: { image: "javascript:alert(1)", alt: "bad" } }), /Expected HTTPS/);
  assert.throws(() => renderProducts({ ...fixture, products: [{ ...fixture.products[0], repository: "javascript:alert(1)" }] }, {}), /Expected HTTPS/);
});

test("uses the release metrics fields with an accurate definition", () => {
  assert.match(readme, /label=Release%20downloads&amp;query=%24\.total/);
  assert.match(readme, /label=Last%20updated&amp;query=%24\.asOfDisplay/);
  assert.match(readme, /alt="GitHub release asset downloads across CAVI repositories"/);
});

test("retains all models and valid catalog markers", () => {
  for (const model of catalog.models) assert.ok(readme.includes(`https://huggingface.co/${model.id}`));
  assert.throws(() => renderProfile("# Profile", catalog, curation), /no catalog:products block/);
  assert.throws(() => renderProfile(readme, { ...catalog, schema: 2 }, curation), /Unsupported catalog schema/);
});
