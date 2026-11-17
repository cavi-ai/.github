// Render the profile catalog from the site snapshot and profile-owned curation.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const PRODUCTS = /(<!-- catalog:products -->\n)[\s\S]*?(<!-- \/catalog:products -->)/u;
const MODELS = /(<!-- catalog:models -->\n)[\s\S]*?(<!-- \/catalog:models -->)/u;
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const url = (value) => {
  const parsed = new URL(value);
  if (parsed.protocol !== "https:") throw new Error(`Expected HTTPS URL: ${value}`);
  return escapeHtml(parsed.href);
};
const cell = (text) => text.replaceAll("|", "\\|").replace(/\s*\n\s*/gu, " ");

function card(product, curated) {
  const repo = url(product.repository);
  const setup = url(curated?.setup ?? product.page);
  const description = escapeHtml(curated?.description ?? product.summary);
  const image = curated?.image ? `<a href="${repo}"><img src="${url(curated.image)}" alt="${escapeHtml(curated.alt)}" width="100%"></a><br>` : "";
  return `<td width="50%" valign="top">${image}<strong>${escapeHtml(product.name)}</strong><br>${description}<br><a href="${repo}">Repository</a> · <a href="${setup}">Explore &amp; setup</a></td>`;
}

export function renderProducts(catalog, curation) {
  return catalog.categories.flatMap((category) => {
    const products = catalog.products.filter((product) => product.category === category.slug);
    if (category.slug === "host-plugins") products.sort((a, b) => Number(a.slug === "antigravity") - Number(b.slug === "antigravity"));
    if (!products.length) return [];
    const rows = [];
    const illustrated = products.filter((p) => curation[p.slug]?.image);
    const textOnly = products.filter((p) => !curation[p.slug]?.image);
    for (let i = 0; i < illustrated.length; i += 2) {
      const cells = illustrated.slice(i, i + 2).map((p) => card(p, curation[p.slug]));
      if (cells.length === 1) cells.push('<td width="50%" valign="top"></td>');
      rows.push(`  <tr>\n    ${cells.join("\n    ")}\n  </tr>`);
    }
    const grid = rows.length ? ["<table>", ...rows, "</table>", ""] : [];
    const list = textOnly.map((p) => `<li><strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(curation[p.slug]?.description ?? p.summary)} <a href="${url(p.repository)}">Repository</a> · <a href="${url(curation[p.slug]?.setup ?? p.page)}">Explore &amp; setup</a></li>`);
    return [`### ${category.label}`, "", ...grid, ...(list.length ? ["<ul>", ...list, "</ul>", ""] : [])];
  }).join("\n");
}

function modelRow(model) {
  const base = model.base && `Base model [\`${model.base.name}\`](${model.base.href})`;
  const summary = [model.task, model.format, model.scope, base].filter(Boolean).join(". ");
  return `| [\`${model.id}\`](${model.href}) | ${cell(`${summary}.`)} | \`${model.install}\` |`;
}
export function renderModels(catalog) {
  return ["| Model | What it does | Download |", "| :-- | :-- | :-- |", ...catalog.models.map(modelRow), ""].join("\n");
}
export function renderProfile(readme, catalog, curation) {
  if (catalog.schema !== 1) throw new Error(`Unsupported catalog schema ${catalog.schema}`);
  for (const [name, marker] of [["products", PRODUCTS], ["models", MODELS]]) if (!marker.test(readme)) throw new Error(`profile/README.md has no catalog:${name} block`);
  return readme.replace(PRODUCTS, (_, open, close) => `${open}${renderProducts(catalog, curation)}${close}`).replace(MODELS, (_, open, close) => `${open}${renderModels(catalog)}${close}`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const readmeUrl = new URL("../profile/README.md", import.meta.url);
  const catalog = JSON.parse(await readFile(new URL("../catalog/site-catalog.json", import.meta.url), "utf8"));
  const curation = JSON.parse(await readFile(new URL("../profile/product-curation.json", import.meta.url), "utf8"));
  const readme = await readFile(readmeUrl, "utf8");
  const rendered = renderProfile(readme, catalog, curation);
  if (process.argv.includes("--check")) {
    if (rendered !== readme) { console.error("profile/README.md is out of date with catalog/site-catalog.json and profile curation"); process.exit(1); }
  } else if (rendered !== readme) { await writeFile(readmeUrl, rendered); console.log("profile/README.md updated"); }
}
