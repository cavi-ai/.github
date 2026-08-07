import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readme = await readFile(new URL("../profile/README.md", import.meta.url), "utf8");
const knowledgeWorkflows = readme.match(
  /### 04 · Knowledge workflows\n(?<body>[\s\S]*?)(?=\n## )/,
)?.groups?.body ?? "";

test("presents CAVI-AI through four evergreen major product lines", () => {
  for (const marker of [
    "https://cavi-ai.xyz",
    "Open research",
    "Agent runtime infrastructure",
    "Secure browser automation",
    "Local AI on Apple Silicon",
    "Knowledge workflows",
    "@cavi-ai/api-client",
    "bobby-browser",
    "mlx-agent",
    "obsidian-agent",
    "cavi-ai/plugins",
    "cross-host",
    "official Obsidian CLI",
    "Claude",
    "Codex",
    "Gemini",
    "OpenCode",
    "AgentSkills",
    "More work is in development",
  ]) assert.ok(readme.includes(marker), `missing ${marker}`);
});

test("presents every approved public product with normalized display names", () => {
  for (const marker of [
    "CAVI API Client",
    "Bobby Browser",
    "MLX Agent",
    "MLX Workbench",
    "Companion for Claude",
    "CAVI Plugins",
    "Antigravity for OpenClaw",
    "https://github.com/cavi-ai/mlx-workbench",
    "https://github.com/cavi-ai/openclaw-antigravity",
    "https://github.com/cavi-ai/companion-for-claude",
  ]) assert.ok(readme.includes(marker), `missing ${marker}`);

  assert.doesNotMatch(readme, /https:\/\/github\.com\/cavi-ai\/claude-obsidian/i);
});

test("keeps the public profile scoped, stable, and accurate", () => {
  assert.match(readme, /logo-wordmark\.png/);
  assert.match(readme, /gateway-agnostic/i);
  assert.match(readme, /\balpha\b/i);
  assert.doesNotMatch(readme, /canonical runtime contract/i);
  assert.doesNotMatch(readme, /latest releases?/i);
  assert.doesNotMatch(readme, /\bv?\d+\.\d+\.\d+\b/);
  assert.doesNotMatch(readme, /cavi-ai\/claude-plugins/i);
  assert.doesNotMatch(readme, /cavi-ai\/claude-obsidian(?:-plugin)?/i);
  assert.doesNotMatch(readme, /claude-obsidian@claude-plugins/i);
  assert.doesNotMatch(readme, /shared Claude/i);
  for (const privateName of ["cavi-control-ui", "ecg", "cc-hermes", "cavi-fleet-router"])
    assert.ok(!readme.includes(privateName), `must not expose ${privateName}`);
});

test("keeps Companion separate from the universal Obsidian plugin", () => {
  assert.match(knowledgeWorkflows, /Companion for Claude/);
  assert.match(knowledgeWorkflows, /separate specialized product/i);
  assert.match(knowledgeWorkflows, /not required by `obsidian-agent`/i);
});

test("states the universal Obsidian plugin's CLI-only dependency boundary", () => {
  assert.match(knowledgeWorkflows, /official Obsidian CLI/);
  assert.match(knowledgeWorkflows, /has no MCP dependency/i);
  assert.doesNotMatch(knowledgeWorkflows, /(?:requires?|depends? on|dependency[^.]*on)\s+(?:an?\s+)?MCP/i);
  assert.doesNotMatch(knowledgeWorkflows, /MCP bridge/i);
});
