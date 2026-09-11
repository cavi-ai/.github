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
  // Secure Agent (flagship).
  assert.match(readme, /secret-leak firewall/i);
  assert.match(readme, /egress/i);
  // API client.
  assert.match(readme, /gateway-agnostic/i);
  assert.match(readme, /agent runtime infrastructure/i);
  // Bobby Browser ships as alpha.
  assert.match(readme, /\balpha\b/i);
  // MLX on Apple Silicon.
  assert.match(readme, /Apple Silicon/i);
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

test("leads the product list with the Secure Agent flagship", () => {
  assert.ok(
    readme.indexOf("Secure Agent") < readme.indexOf("CAVI API Client"),
    "Secure Agent must be listed first",
  );
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
