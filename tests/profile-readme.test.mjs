import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const readme = await readFile(new URL("../profile/README.md", import.meta.url), "utf8");

const productRow = (name) => readme.split("\n").find((line) => line.startsWith(`| [**${name}**](`));
const section = (heading) => readme.split(/\n(?=#{2,3} )/).find((part) => part.startsWith(heading));

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

test("names every product in title case", () => {
  const titleCase = (name) => name.split(" ").every((word) => word === "for" || /^[A-Z]/.test(word));
  for (const [, name] of readme.matchAll(/^\| \[\*\*([^*]+)\*\*\]/gm))
    assert.ok(titleCase(name), `product name "${name}" is not title case`);
  for (const [, name] of readme.matchAll(/^### (.+)$/gm))
    if (readme.includes(`[**${name}**]`)) assert.ok(titleCase(name), `flagship "${name}" is not title case`);
});

test("lists the hosts the plugin catalog supports", () => {
  const pluginsRow = productRow("CAVI Plugins");
  for (const host of ["Claude", "Codex", "Agy", "OpenCode", "OpenClaw", "Hermes", "AgentSkills"])
    assert.ok(pluginsRow.includes(host), `CAVI Plugins row missing ${host}`);
  assert.doesNotMatch(pluginsRow, /Gemini/);
});

test("presents every approved public product once through its exact Markdown link", () => {
  for (const link of [
    "[**Secure Agent**](https://github.com/cavi-ai/secure-agent)",
    "[**CAVI API Client**](https://github.com/cavi-ai/cavi-api-client)",
    "[**Bobby Browser**](https://github.com/cavi-ai/bobby-browser)",
    "[**MLX Agent**](https://github.com/cavi-ai/mlx-agent)",
    "[**MLX Workbench**](https://github.com/cavi-ai/mlx-workbench)",
    "[**Companion for Claude**](https://github.com/cavi-ai/companion-for-claude)",
    "[**Obsidian Agent**](https://github.com/cavi-ai/obsidian-agent)",
    "[**MCP Eval**](https://github.com/cavi-ai/mcp-eval)",
    "[**Ableton MCP**](https://github.com/cavi-ai/ableton-mcp)",
    "[**CAVI Plugins**](https://github.com/cavi-ai/plugins)",
    "[**Antigravity for OpenClaw**](https://github.com/cavi-ai/openclaw-antigravity)",
    "[**Blender MCP**](https://github.com/cavi-ai/blender-mcp)",
    "[**Loop Killer**](https://github.com/cavi-ai/loop-killer)",
    "[**Substance MCP**](https://github.com/cavi-ai/substance-mcp)",
    "[**Adobe MCP**](https://github.com/cavi-ai/adobe-mcp)",
    "[**MCP Core**](https://github.com/cavi-ai/mcp-core)",
  ]) assert.equal(readme.split(link).length - 1, 1, `${link} must appear exactly once`);
  assert.doesNotMatch(readme, /claude-obsidian/i);
  assert.doesNotMatch(readme, /^## Install/m, "products are not listed a second time in an Install section");
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

test("describes each product accurately", () => {
  // Secure Agent monitors by default; guards and the proxy are optional.
  const secureAgentRow = productRow("Secure Agent");
  assert.match(secureAgentRow, /local monitor for AI coding agents/i);
  assert.match(secureAgentRow, /optional guards/i);
  assert.match(secureAgentRow, /opt-in proxy/i);
  assert.doesNotMatch(readme, /firewall|correlates/i);
  // API client.
  const apiClientRow = productRow("CAVI API Client");
  assert.match(apiClientRow, /gateway-agnostic/i);
  assert.match(apiClientRow, /agent runtime infrastructure/i);
  // Bobby Browser ships as alpha.
  assert.match(section("### Bobby Browser"), /\balpha\b/i);
  // MLX on Apple Silicon.
  assert.match(readme, /Apple Silicon/i);
  // MLX Agent ships Antigravity (agy) adapters, not Gemini.
  const mlxAgentRow = productRow("MLX Agent");
  assert.match(mlxAgentRow, /Antigravity/);
  assert.doesNotMatch(mlxAgentRow, /Gemini/);
  // Ableton MCP — guarded Live control.
  const abletonRow = productRow("Ableton MCP");
  assert.match(abletonRow, /Ableton Live/);
  assert.match(abletonRow, /confirm-to-execute/);
  // Companion — the exact Community Store description.
  assert.match(
    readme,
    /Obsidian Community Store release for Claude knowledge workflows/,
  );
  // MCP Eval — evidence-driven evaluation dimensions.
  for (const dimension of [
    "discovery cost",
    "schema guessability",
    "error honesty",
    "state recovery",
    "contention",
    "actionable findings",
  ]) assert.match(productRow("MCP Eval"), new RegExp(dimension, "i"));
  // Blender MCP — local bridge behind a session token.
  const blenderRow = productRow("Blender MCP");
  assert.match(blenderRow, /loopback/);
  assert.match(blenderRow, /session token/);
  // Loop Killer — clears the goal behind a stop-hook loop.
  const loopKillerRow = productRow("Loop Killer");
  assert.match(loopKillerRow, /Claude Code plugin/);
  assert.match(loopKillerRow, /stop-hook/);
  // Substance MCP — one server per Adobe app, receipts across all three.
  const substanceRow = productRow("Substance MCP");
  assert.match(substanceRow, /Painter, Designer and Sampler/);
  assert.match(substanceRow, /SHA-256 receipts/);
  // Adobe MCP — macOS servers that edit owned copies and journal native operations.
  const adobeRow = productRow("Adobe MCP");
  assert.match(adobeRow, /Photoshop, Illustrator, After Effects, Animate, Character Animator and Dimension/);
  assert.match(adobeRow, /macOS/);
  assert.match(adobeRow, /owned copies/);
  // MCP Core — the shared server type and failure contract.
  const coreRow = productRow("MCP Core");
  assert.match(coreRow, /failure contract/);
  assert.match(coreRow, /operation journal/);
});

test("leads with the featured products, each listed once", () => {
  const start = readme.indexOf("## Start here");
  const stack = readme.indexOf("## Explore the stack");
  assert.ok(start !== -1 && start < stack, "Start here must precede the stack");
  const startHere = readme.slice(start, stack);
  assert.deepEqual(
    [...startHere.matchAll(/^### (.+)$/gm)].map(([, name]) => name),
    ["Companion for Claude", "Bobby Browser"],
  );
  for (const link of ["[**Companion for Claude**]", "[**Bobby Browser**]"])
    assert.ok(startHere.includes(link), `${link} lives under Start here`);
});

test("installs each product beside its description under its published name", () => {
  const installs = {
    "Ableton MCP": ["`npm install -g @cavi-ai/ableton-mcp`", "`ableton-mcp install`"],
    "Blender MCP": ["`uv tool install cavi-blender-mcp`", "`cavi-blender-mcp runtime start`"],
    "Substance MCP": ["`uv tool install cavi-substance-mcp`"],
    "Adobe MCP": ["`uv tool install cavi-adobe-mcp`"],
    "Secure Agent": ["https://github.com/cavi-ai/secure-agent/releases/latest"],
    "MCP Eval": ["`brew install cavi-ai/tap/mcpeval`"],
    "CAVI API Client": ["`npm install @cavi-ai/api-client`"],
    "MCP Core": ["`uv add cavi-mcp-core`"],
    "MLX Agent": ["`claude plugin marketplace add cavi-ai/mlx-agent`", "`claude plugin install mlx-agent@mlx-agent`"],
    "MLX Workbench": ["https://github.com/cavi-ai/mlx-workbench/releases/latest"],
    "CAVI Plugins": ["`claude plugin marketplace add cavi-ai/plugins`"],
    "Obsidian Agent": ["`/plugin install obsidian-agent@obsidian-agent`"],
    "Antigravity for OpenClaw": ["`openclaw plugins install @cavi-ai/antigravity`"],
    "Loop Killer": ["`claude plugin marketplace add cavi-ai/plugins`", "`/plugin install loop-killer@cavi-ai`"],
  };
  const listed = [...readme.matchAll(/^\| \[\*\*([^*]+)\*\*\]/gm)].map(([, name]) => name);
  assert.deepEqual([...listed].sort(), Object.keys(installs).sort(), "every table product has an install");
  for (const [name, commands] of Object.entries(installs)) {
    const cells = productRow(name).split(" | ");
    assert.equal(cells.length, 3, `${name} row has Project, What it does and Install cells`);
    for (const command of commands) assert.ok(cells[2].includes(command), `${name} install missing ${command}`);
  }
  assert.ok(section("### Companion for Claude").includes("https://obsidian.md/plugins?id=claude-companion"));
  assert.ok(section("### Bobby Browser").includes("brew install cavi-ai/tap/bobby-browser"));
  assert.doesNotMatch(productRow("Ableton MCP"), /ableton-mcp#install/, "Ableton MCP installs from npm");
  assert.doesNotMatch(productRow("Blender MCP"), /blender-mcp#install/, "Blender MCP installs from PyPI");
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
    "community-plugin-stats.json",
    "https://obsidian.md/plugins?id=claude-companion",
    "https://github.com/cavi-ai/homebrew-tap",
    "https://cavi-ai.xyz/docs",
  ]) assert.ok(badges.includes(marker), `missing badge marker ${marker}`);
  // The organization has no social accounts yet.
  assert.doesNotMatch(readme, /discord\.|x\.com\/|twitter\.com\/|linkedin\.com\//i);
});

test("groups the rest of the stack by job", () => {
  const groups = {
    "### Control creative apps over MCP": ["Ableton MCP", "Blender MCP", "Substance MCP", "Adobe MCP"],
    "### Secure and evaluate agents": ["Secure Agent", "MCP Eval"],
    "### Build agent integrations": ["CAVI API Client", "MCP Core"],
    "### Run local models on Apple Silicon": ["MLX Agent", "MLX Workbench"],
    "### Plugins for agent hosts": [
      "CAVI Plugins",
      "Obsidian Agent",
      "Antigravity for OpenClaw",
      "Loop Killer",
    ],
  };
  const stack = readme.slice(readme.indexOf("## Explore the stack"));
  assert.deepEqual([...stack.matchAll(/^### .+$/gm)].map(([heading]) => heading), Object.keys(groups));
  for (const [heading, products] of Object.entries(groups)) {
    const part = section(heading);
    assert.ok(part.includes("| Project | What it does | Install |"), `${heading} has an Install column`);
    const listed = [...part.matchAll(/^\| \[\*\*([^*]+)\*\*\]/gm)].map(([, name]) => name);
    assert.deepEqual(listed, products, `${heading} lists exactly its products`);
  }
});

test("makes only claims every listed project meets", () => {
  // Not every published package carries a provenance attestation.
  assert.doesNotMatch(readme, /provenance/i);
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
