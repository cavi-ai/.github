import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (name) => readFile(new URL(`../${name}`, import.meta.url), "utf8");

test("security policy routes every report privately", async () => {
  const policy = await read("SECURITY.md");
  assert.match(policy, /do not open a public issue/i);
  assert.match(policy, /Security → Report a vulnerability/);
  assert.match(policy, /sasan1200@gmail\.com/);
  assert.match(policy, /own SECURITY\.md/);
});

test("code of conduct is the organization's shared text", async () => {
  const conduct = await read("CODE_OF_CONDUCT.md");
  assert.match(conduct, /Report conduct concerns to sasan1200@gmail\.com/);
  assert.match(conduct, /Contributor Covenant/);
});

test("contributing guide defers to repository guides and links the policies", async () => {
  const guide = await read("CONTRIBUTING.md");
  assert.match(guide, /own CONTRIBUTING\.md/);
  assert.ok(guide.includes("](SECURITY.md)"), "links SECURITY.md");
  assert.ok(guide.includes("](CODE_OF_CONDUCT.md)"), "links CODE_OF_CONDUCT.md");
});
