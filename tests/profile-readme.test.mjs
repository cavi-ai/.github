import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readme = await readFile(new URL("../profile/README.md", import.meta.url), "utf8");

test("presents CAVI-AI as a research company with two current product lines", () => {
  for (const marker of [
    "https://cavi-ai.xyz",
    "Open research",
    "Agent runtime infrastructure",
    "Knowledge workflows",
    "@cavi-ai/api-client",
    "Companion for Claude",
    "claude-obsidian",
    "More work is in development",
  ]) assert.ok(readme.includes(marker), `missing ${marker}`);
});

test("keeps the public profile scoped and accurate", () => {
  assert.match(readme, /logo-wordmark\.png/);
  assert.match(readme, /gateway-agnostic/i);
  assert.doesNotMatch(readme, /canonical runtime contract/i);
  for (const privateName of ["cavi-control-ui", "ecg", "cc-hermes", "cavi-fleet-router"])
    assert.ok(!readme.includes(privateName), `must not expose ${privateName}`);
});
