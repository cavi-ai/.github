# Cross-Host Plugin Marketplace Design

## Objective

Make CAVI’s public plugin ecosystem host-agnostic. Rename the Claude-specific marketplace to `cavi-ai/plugins`, convert the separate Claude Obsidian marketplace package into `cavi-ai/obsidian-agent`, and align the GitHub organization profile with those products.

The Obsidian community plugin, Companion for Claude, is outside this migration. It remains a separate product and is not a dependency of `obsidian-agent`.

## Public identities

| Current repository | New repository | Public role |
| --- | --- | --- |
| `cavi-ai/claude-plugins` | `cavi-ai/plugins` | Canonical catalog for CAVI’s installable agent extensions |
| `cavi-ai/claude-obsidian-plugin` | `cavi-ai/obsidian-agent` | Portable vault-workflow plugin for agent hosts |
| `cavi-ai/.github` | unchanged | Organization profile describing the shared marketplace |

The plugin identity is `obsidian-agent`. The marketplace identity is `plugins`. GitHub’s repository-rename redirects provide the compatibility path for old repository URLs; new documentation and manifests must use only the new identities.

## Marketplace architecture

`cavi-ai/plugins` is a catalog, not a source-code monorepo. It contains:

- A host-neutral canonical catalog describing each plugin, source repository, license, summary, and supported hosts.
- Host-native marketplace projections required by supported clients. These projections contain only entries that the corresponding host can install.
- Documentation that starts with the host-neutral catalog and then gives host-specific installation instructions.
- Validation tests that ensure every projected entry exists in the canonical catalog and that repository identities, plugin names, and host claims agree.

The initial canonical catalog contains only installable plugin packages:

1. `mlx-agent`, sourced from `cavi-ai/mlx-agent`.
2. `obsidian-agent`, sourced from `cavi-ai/obsidian-agent`.

It does not list runtimes or libraries such as `bobby-browser` or `@cavi-ai/api-client`. Those remain major organization products but are not mislabeled as plugins.

The initial host vocabulary is `claude`, `codex`, `gemini`, `opencode`, and `agentskills`. A plugin may claim a host only when the source repository contains a validated package or adapter for that host.

## Universal Obsidian plugin architecture

`cavi-ai/obsidian-agent` owns one canonical collection of portable skills. Skills perform vault operations through the official `obsidian` CLI and never require MCP, Companion for Claude, or Anthropic APIs.

The runtime floor is Obsidian 1.12.7 with the official CLI registered as `obsidian`. The plugin checks the CLI before performing work and provides an actionable setup message when it is missing or too old. Commands select a vault explicitly when context is ambiguous and request structured output, such as JSON, when the CLI supports it.

The source layout separates portable behavior from host packaging:

- Canonical AgentSkills-compatible skills contain the workflow and safety instructions.
- Thin provider directories package those skills for Claude, Codex, Gemini, and OpenCode without copying workflow logic.
- Provider manifests expose the native invocation form for their host.
- A root manifest records the provider support matrix, required Obsidian version, install artifacts, and safety constraints.

Existing Claude slash commands remain available through the Claude adapter, but their instructions delegate to the same portable skills. Host-specific wording such as “Claude session,” `claude-html`, Claude cloud dispatch, and Claude-only scheduling is removed from the portable core or isolated in an explicitly Claude-only adapter capability. A capability is not advertised as universal until its CLI implementation and tests are portable.

## CLI and safety contract

Read operations use official commands such as `obsidian search`, `obsidian read`, `obsidian files`, `obsidian tags`, `obsidian backlinks`, and `obsidian links`, selecting JSON or another stable machine-readable format where available.

Write operations use official commands such as `obsidian create`, `obsidian append`, and property or task commands. Every destructive or replacing operation remains preview-and-confirm. Skills must not invoke `obsidian eval` as a general escape hatch; provider-neutral workflows use documented CLI commands so their behavior is auditable and portable.

The plugin does not install Obsidian, enable the CLI setting, launch package managers, persist credentials, or edit vault files outside the reviewed CLI operation. If the Obsidian application must be launched by the CLI, that is an Obsidian-owned behavior and must be explained in setup documentation.

## Migration sequence

1. Prepare and validate `obsidian-agent` content while the old repository name still resolves.
2. Rename `cavi-ai/claude-obsidian-plugin` to `cavi-ai/obsidian-agent`, then update its manifests, documentation, tests, and internal links.
3. Prepare the neutral catalog and host projections in the marketplace repository.
4. Rename `cavi-ai/claude-plugins` to `cavi-ai/plugins`, then update its metadata and documentation.
5. Update the CAVI organization profile to link `cavi-ai/plugins` and describe a shared cross-host plugin marketplace.
6. Verify old GitHub URLs redirect, new repository URLs resolve, all catalog projections validate, plugin tests pass, and the organization profile test passes.

Remote repository renames and pushes are external state changes. Resolve and verify the exact repository owner, current name, default branch, local checkout, and clean worktree immediately before each mutation. Never rename a repository before its replacement content and rollback path are ready.

## Organization profile

The profile retains four major product lines. The knowledge-workflow line distinguishes the two Obsidian products:

- Companion for Claude is the Obsidian community application experience.
- `obsidian-agent` is the host-neutral CLI-powered agent plugin.

The profile links `cavi-ai/plugins` as the shared marketplace and avoids presenting Claude commands as the organization-wide installation path. It remains evergreen and does not include release numbers.

## Verification

### Marketplace

- Parse the canonical catalog and every host projection.
- Reject unknown hosts, duplicate plugin identities, missing source repositories, identity mismatches, and projections unsupported by the canonical host matrix.
- Require both `mlx-agent` and `obsidian-agent`.
- Reject the legacy canonical identities `claude-plugins` and `claude-obsidian` from new metadata and documentation, except in an explicit migration note.

### Obsidian agent

- Validate every skill’s frontmatter and provider packaging.
- Test CLI command construction, vault selection, structured-output parsing, missing-CLI errors, minimum-version errors, and preview-before-write behavior.
- Scan the portable core for MCP configuration, Companion dependencies, Anthropic API dependencies, and unscoped Claude-only terminology.
- Run existing registry and skill tests, updating fixtures only where the CLI contract intentionally changes them.

### Organization profile

- Require the four product lines, `bobby-browser`, `mlx-agent`, `obsidian-agent`, and `cavi-ai/plugins`.
- Preserve the API-client follower/mirror language and private-name exclusions.
- Reject Claude-only marketplace positioning, release-number feeds, and legacy marketplace links.
