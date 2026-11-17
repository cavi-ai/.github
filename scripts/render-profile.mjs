// Renders the product and model tables in profile/README.md from the
// cavi-ai.xyz catalog (https://cavi-ai.xyz/catalog.json). Everything outside
// the catalog markers is written by hand.
//
//   node scripts/render-profile.mjs           rewrite profile/README.md
//   node scripts/render-profile.mjs --check   exit 1 when it is out of date

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const PRODUCTS = /(<!-- catalog:products exclude="([^"]*)" -->\n)[\s\S]*?(<!-- \/catalog:products -->)/u;
const MODELS = /(<!-- catalog:models -->\n)[\s\S]*?(<!-- \/catalog:models -->)/u;

const cell = (text) => text.replaceAll("|", "\\|").replace(/\s*\n\s*/gu, " ");

function productRow(product) {
  const summary = product.status ? `${product.status}. ${product.summary}` : product.summary;
  // The command is the first step; the product page carries every step.
  const guide = `[Install guide](${product.page})`;
  const install = product.install ? `\`${product.install}\` · ${guide}` : guide;
  return `| [**${product.name}**](${product.repository}) | ${cell(summary)} | ${cell(install)} |`;
}

export function renderProducts(catalog, exclude) {
  const products = catalog.products.filter((product) => !exclude.has(product.slug));
  return catalog.categories.flatMap((category) => {
    const rows = products.filter((product) => product.category === category.slug);
    if (rows.length === 0) return [];
    return [`### ${category.label}`, "", "| Project | What it does | Install |", "| :-- | :-- | :-- |", ...rows.map(productRow), ""];
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

export function renderProfile(readme, catalog) {
  if (catalog.schema !== 1) throw new Error(`Unsupported catalog schema ${catalog.schema}`);
  for (const [name, marker] of [["products", PRODUCTS], ["models", MODELS]])
    if (!marker.test(readme)) throw new Error(`profile/README.md has no catalog:${name} block`);
  return readme
    .replace(PRODUCTS, (_, open, exclude, close) =>
      `${open}${renderProducts(catalog, new Set(exclude.split(",").filter(Boolean)))}${close}`)
    .replace(MODELS, (_, open, close) => `${open}${renderModels(catalog)}${close}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const readmeUrl = new URL("../profile/README.md", import.meta.url);
  const catalog = JSON.parse(await readFile(new URL("../catalog/site-catalog.json", import.meta.url), "utf8"));
  const readme = await readFile(readmeUrl, "utf8");
  const rendered = renderProfile(readme, catalog);
  if (process.argv.includes("--check")) {
    if (rendered !== readme) {
      console.error("profile/README.md is out of date with catalog/site-catalog.json");
      process.exit(1);
    }
  } else if (rendered !== readme) {
    await writeFile(readmeUrl, rendered);
    console.log("profile/README.md updated from catalog/site-catalog.json");
  }
}
