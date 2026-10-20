import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const readme = await readFile(new URL("../profile/README.md", import.meta.url), "utf8");

test("presents CAVI-AI with its positioning and canonical links", () => {
  for (const marker of [
    "https://cavi-ai.xyz",
    "Open research",
    "MIT",
    "More work is in development",
    // Hosts the plugin catalog supports.
    "Claude",
    "Codex",
    "Gemini",
    "OpenCode",
    "AgentSkills",
  ]) assert.ok(readme.includes(marker), `missing ${marker}`);
});

test("presents every approved public product through its exact Markdown link", () => {
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
  ]) assert.ok(readme.includes(link), `missing exact product link: ${link}`);
  assert.doesNotMatch(readme, /claude-obsidian/i);
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
  const secureAgentRow = readme.split("\n").find((line) => line.includes("[**Secure Agent**]"));
  assert.match(secureAgentRow, /local monitor for AI coding agents/i);
  assert.match(secureAgentRow, /optional guards/i);
  assert.match(secureAgentRow, /opt-in proxy/i);
  assert.doesNotMatch(readme, /firewall|correlates/i);
  // API client.
  assert.match(readme, /gateway-agnostic/i);
  assert.match(readme, /agent runtime infrastructure/i);
  // Bobby Browser ships as alpha.
  assert.match(readme, /\balpha\b/i);
  // MLX on Apple Silicon.
  assert.match(readme, /Apple Silicon/i);
  // MLX Agent ships Antigravity (agy) adapters, not Gemini.
  const mlxAgentRow = readme.split("\n").find((line) => line.includes("[**MLX Agent**]"));
  assert.match(mlxAgentRow, /Antigravity/);
  assert.doesNotMatch(mlxAgentRow, /Gemini/);
  // Ableton MCP — guarded Live control.
  assert.match(readme, /Ableton Live/);
  assert.match(readme, /confirm-to-execute/);
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
  ]) assert.match(readme, new RegExp(dimension, "i"));
});

test("leads with the most-starred products, each listed once", () => {
  const start = readme.indexOf("## Start here");
  const stack = readme.indexOf("## Explore the stack");
  assert.ok(start !== -1 && start < stack, "Start here must precede the stack");
  const flagships = [
    "[**Companion for Claude**]",
    "[**Bobby Browser**]",
    "[**Ableton MCP**]",
  ].map((link) => readme.indexOf(link));
  assert.deepEqual([...flagships].sort((a, b) => a - b), flagships, "flagship order");
  for (const position of flagships)
    assert.ok(position > start && position < stack, "flagships live under Start here");
  for (const link of ["[**Companion for Claude**]", "[**Bobby Browser**]", "[**Ableton MCP**]"])
    assert.equal(readme.split(link).length - 1, 1, `${link} must appear once`);
});

test("installs each packaged product in one line under its published name", () => {
  const install = readme.split(/\n(?=## )/).find((part) => part.startsWith("## Install"));
  assert.ok(install, "missing Install section");
  for (const line of [
    "https://obsidian.md/plugins?id=claude-companion",
    "`brew install cavi-ai/tap/bobby-browser`",
    "`brew install cavi-ai/tap/mcpeval`",
    "`npm install @cavi-ai/api-client`",
    "https://github.com/cavi-ai/ableton-mcp#install",
  ]) assert.ok(install.includes(line), `missing install line: ${line}`);
  assert.ok(
    readme.indexOf("## Install") < readme.indexOf("## Explore the stack"),
    "Install precedes the stack",
  );
});

test("groups the rest of the stack by job", () => {
  const groups = {
    "### Secure and evaluate agents": ["Secure Agent", "MCP Eval"],
    "### Run local models on Apple Silicon": ["MLX Agent", "MLX Workbench"],
    "### Connect and extend agent hosts": [
      "CAVI API Client",
      "CAVI Plugins",
      "Obsidian Agent",
      "Antigravity for OpenClaw",
    ],
  };
  const sections = readme.split(/\n(?=#{2,3} )/);
  for (const [heading, products] of Object.entries(groups)) {
    const section = sections.find((part) => part.startsWith(heading));
    assert.ok(section, `missing ${heading}`);
    for (const product of products)
      assert.ok(section.includes(`[**${product}**]`), `${product} belongs under ${heading}`);
  }
});

test("keeps the public profile scoped, stable, and version-free", () => {
  // No pinned version numbers: the profile must not rot as releases move.
  assert.doesNotMatch(readme, /\bv?\d+\.\d+\.\d+\b/);
  assert.doesNotMatch(readme, /latest releases?/i);
  assert.doesNotMatch(readme, /canonical runtime contract/i);
  assert.doesNotMatch(readme, /cavi-ai\/claude-obsidian(?:-plugin)?/i);
  for (const privateName of ["cavi-control-ui", "ecg", "cc-hermes", "cavi-fleet-router"])
    assert.ok(!readme.includes(privateName), `must not expose ${privateName}`);
});
