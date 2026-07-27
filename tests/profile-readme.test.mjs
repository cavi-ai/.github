import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readme = await readFile(new URL("../profile/README.md", import.meta.url), "utf8");

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
    "Companion for Claude",
    "claude-obsidian",
    "cavi-ai/claude-plugins",
    "More work is in development",
  ]) assert.ok(readme.includes(marker), `missing ${marker}`);
});

test("keeps the public profile scoped, stable, and accurate", () => {
  assert.match(readme, /logo-wordmark\.png/);
  assert.match(readme, /gateway-agnostic/i);
  assert.match(readme, /\balpha\b/i);
  assert.doesNotMatch(readme, /canonical runtime contract/i);
  assert.doesNotMatch(readme, /latest releases?/i);
  assert.doesNotMatch(readme, /\bv?\d+\.\d+\.\d+\b/);
  for (const privateName of ["cavi-control-ui", "ecg", "cc-hermes", "cavi-fleet-router"])
    assert.ok(!readme.includes(privateName), `must not expose ${privateName}`);
});
