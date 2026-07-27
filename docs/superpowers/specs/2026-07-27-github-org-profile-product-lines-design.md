# GitHub Organization Profile Product Lines

## Objective

Refresh the CAVI-AI GitHub organization profile so it accurately presents the organization’s major public product lines. Keep the profile evergreen: do not add a release feed or version numbers that require frequent maintenance.

## Product structure

The profile will present four product lines in this order:

1. **Agent runtime infrastructure** — `@cavi-ai/api-client`, described as a provider- and gateway-agnostic TypeScript client that mirrors upstream runtime contracts rather than owning them.
2. **Secure browser automation** — `bobby-browser`, described as an alpha browser automation runtime with authenticated, capability-scoped Rust, TypeScript, MCP, and CDP surfaces.
3. **Local AI on Apple Silicon** — `mlx-agent`, described as a cross-host plugin and portable skill set for discovering, verifying, and wiring MLX-optimized models.
4. **Knowledge workflows** — Companion for Claude and `claude-obsidian`, paired through the local MCP bridge and distributed through CAVI’s shared Claude Code plugin marketplace.

## Content and layout

Retain the current wordmark, opening positioning, website link, repository link, “What we’re testing,” and “Built in the open” sections. Expand “What we’re building” from three to four numbered entries. Each entry will have one concise paragraph and, when useful, one canonical install or start command.

The copy will favor stable capabilities over current version numbers. Repository names will link directly to their public GitHub pages. `bobby-browser` will be labeled alpha so the organization profile does not imply a 1.0 stability guarantee.

The knowledge-workflow entry will point readers to the `claude-plugins` marketplace as the common discovery and installation surface. It will not give every supporting repository its own product-line section.

## Accuracy constraints

- Preserve the statement that `@cavi-ai/api-client` follows or mirrors upstream contracts and is not their canonical owner.
- Mention only public repositories and public capabilities.
- Keep private project names excluded by the existing profile test.
- Avoid release numbers, “latest release” claims, and other fast-aging content.
- Use the exact public repository name `bobby-browser`.

## Verification

Update the Node test to require all four product-line headings, their primary repository names and links, the Claude plugin marketplace, and the stable installation marker. Preserve tests for the wordmark, gateway-agnostic API-client positioning, upstream contract ownership, and private-name exclusions.

Run the profile test with Node and review the rendered Markdown structure for heading order, link correctness, and concise copy.
