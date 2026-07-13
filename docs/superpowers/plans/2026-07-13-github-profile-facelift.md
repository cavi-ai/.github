# GitHub Profile Facelift Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the CAVI-AI organization profile into a research-company front door that links prominently to `cavi-ai.xyz` and clearly presents the two current product lines.

**Architecture:** The public surface remains a single GitHub-rendered Markdown document using the existing repository wordmark. Static assertions protect the approved positioning, public links, product count, and absence of private or unreleased repository names; GitHub organization metadata is updated separately through the GitHub API.

**Tech Stack:** GitHub organization profile README, Markdown, HTML alignment primitives, GitHub CLI/API, Node.js built-in test runner

## Global Constraints

- Lead with independent research-company identity, not sales language.
- Primary destination is exactly `https://cavi-ai.xyz`.
- Present exactly two product lines: agent runtime infrastructure and knowledge workflows.
- Describe `@cavi-ai/api-client` as gateway-agnostic and never as the canonical runtime contract.
- Mention future work without naming or promising unreleased products.
- Keep the existing `profile/logo-wordmark.png` asset.
- Change no repository visibility, membership, security, billing, or unrelated organization setting.

---

### Task 1: Profile content and contract checks

**Files:**
- Modify: `profile/README.md`
- Create: `tests/profile-readme.test.mjs`

**Interfaces:**
- Consumes: Existing `profile/logo-wordmark.png` and public repository URLs.
- Produces: GitHub organization profile Markdown and executable profile contract `node --test tests/profile-readme.test.mjs`.

- [ ] **Step 1: Add the failing profile contract**

Create `tests/profile-readme.test.mjs` that reads `profile/README.md` and asserts:

```js
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
```

- [ ] **Step 2: Run the contract and confirm failure**

Run: `node --test tests/profile-readme.test.mjs`

Expected: failure because the approved research-company headings and future-work statement are absent.

- [ ] **Step 3: Rewrite the profile README**

Replace the current package-first document with:

```markdown
<h1 align="center">
  <a href="https://cavi-ai.xyz"><img src="./logo-wordmark.png" alt="CAVI-AI" width="460"></a>
</h1>

<p align="center">
  <strong>Open research and infrastructure for agent systems.</strong><br>
  We build MIT-licensed tools that make agent runtimes easier to connect, inspect, adapt, and trust.
</p>

<p align="center">
  <a href="https://cavi-ai.xyz"><strong>Visit cavi-ai.xyz →</strong></a>
  ·
  <a href="https://github.com/cavi-ai?tab=repositories">Explore the code</a>
</p>

---

## What we're building

### 01 · Agent runtime infrastructure

[**@cavi-ai/api-client**](https://github.com/cavi-ai/cavi-api-client) is a gateway-agnostic TypeScript client for typed HTTP, WebSocket, and SSE communication with agent runtimes. It provides adapters and compatibility surfaces without claiming ownership of an upstream runtime contract.

```sh
npm install @cavi-ai/api-client
```

### 02 · Knowledge workflows

[**Companion for Claude**](https://github.com/cavi-ai/companion-for-claude) and [**claude-obsidian**](https://github.com/cavi-ai/claude-obsidian) form one local-first workflow: an Obsidian interface and MCP bridge paired with Claude Code commands for synthesis, drafting, tagging, session capture, and interactive artifacts.

```sh
/plugin marketplace add cavi-ai/claude-obsidian
```

## What we're testing

- **Runtime interoperability** across gateways and providers.
- **Contracts over conventions** through typed boundaries and executable checks.
- **Graceful degradation** that returns structured gaps instead of hiding failure.
- **Local-first workflows** that keep developers close to their own knowledge and tools.

## Built in the open

Our public work is released under the MIT license. Read the code, test the assumptions, adapt the tools, and contribute what you learn.

More work is in development. We publish it when there is working software and evidence worth examining.

<p align="center">
  <a href="https://cavi-ai.xyz">cavi-ai.xyz</a> ·
  <a href="https://github.com/cavi-ai?tab=repositories">repositories</a>
</p>
```

- [ ] **Step 4: Run profile and link checks**

Run: `node --test tests/profile-readme.test.mjs`

Expected: 2 tests pass, 0 fail.

Run each public target with `curl -sSIL --fail --max-time 20`: `https://cavi-ai.xyz`, `https://github.com/cavi-ai/cavi-api-client`, `https://github.com/cavi-ai/companion-for-claude`, and `https://github.com/cavi-ai/claude-obsidian`.

Expected: every command exits `0`.

- [ ] **Step 5: Commit the profile**

```bash
git add profile/README.md tests/profile-readme.test.mjs docs/superpowers/plans/2026-07-13-github-profile-facelift.md
git commit -m "docs: refresh CAVI-AI organization profile"
```

### Task 2: Organization metadata and publication

**Files:**
- Verify: `profile/README.md`

**Interfaces:**
- Consumes: Verified profile commit from Task 1 and GitHub organization `cavi-ai`.
- Produces: Public organization description and website fields aligned with the profile.

- [ ] **Step 1: Verify the exact intended metadata patch**

Run: `gh api orgs/cavi-ai --jq '{description,blog}'`

Expected: inspect current values before mutation.

- [ ] **Step 2: Update only approved public metadata**

Run:

```bash
gh api --method PATCH orgs/cavi-ai \
  -f description='Open research and MIT-licensed infrastructure for agent systems.' \
  -f blog='https://cavi-ai.xyz'
```

Expected: response contains the exact description and blog values.

- [ ] **Step 3: Push the profile commit**

Run: `git push origin main`

Expected: local `main` updates `cavi-ai/.github` `main` without force.

- [ ] **Step 4: Verify the public surface**

Run: `gh api orgs/cavi-ai --jq '{description,blog}'`

Run: `gh api repos/cavi-ai/.github/contents/profile/README.md --jq .content | base64 --decode`

Expected: metadata matches exactly; public README contains `https://cavi-ai.xyz`, both product-line headings, and no private repository names.

Run: `git status --short --branch`

Expected: `main` is clean and synchronized with `origin/main`.
