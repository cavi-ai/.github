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
    "agent runtime infrastructure",
    "Secure browser automation",
    "Local AI on Apple Silicon",
    "Knowledge workflows",
    "@cavi-ai/api-client",
    "bobby-browser",
    "mlx-agent",
    "cavi-ai/plugins",
    "Claude",
    "Codex",
    "Gemini",
    "OpenCode",
    "AgentSkills",
    "More work is in development",
  ]) assert.ok(readme.includes(marker), `missing ${marker}`);
});

test("presents every approved public product through its exact Markdown link", () => {
  for (const link of [
    "[**CAVI API Client**](https://github.com/cavi-ai/cavi-api-client)",
    "[**Bobby Browser**](https://github.com/cavi-ai/bobby-browser)",
    "[**MLX Agent**](https://github.com/cavi-ai/mlx-agent)",
    "[**MLX Workbench**](https://github.com/cavi-ai/mlx-workbench)",
    "[**Companion for Claude**](https://github.com/cavi-ai/companion-for-claude)",
    "[**CAVI Plugins**](https://github.com/cavi-ai/plugins)",
    "[**Antigravity for OpenClaw**](https://github.com/cavi-ai/openclaw-antigravity)",
  ]) assert.ok(readme.includes(link), `missing exact product link: ${link}`);

  assert.doesNotMatch(readme, /claude-obsidian/i);
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

test("describes Companion only as the Community Store release", () => {
  assert.match(
    knowledgeWorkflows,
    /^\[\*\*Companion for Claude\*\*\]\(https:\/\/github\.com\/cavi-ai\/companion-for-claude\) is the Obsidian Community Store release for Claude knowledge workflows\.$/m,
  );
});
