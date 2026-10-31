<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./banner-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="./banner-light.png">
  <img src="./banner-light.png" alt="CAVI-AI — open research and infrastructure for agent systems">
</picture>

<h2 align="center">Open research and infrastructure for agent systems.</h2>

<p align="center">MIT-licensed tools that make agent runtimes easier to connect, inspect, secure, and trust.</p>

<p align="center">
  <a href="https://obsidian.md/plugins?id=claude-companion"><img src="https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=Companion%20downloads&query=%24%5B%22claude-companion%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json" alt="Companion for Claude downloads from the Obsidian community store"></a>
  <a href="https://github.com/cavi-ai/homebrew-tap"><img src="https://img.shields.io/badge/brew%20tap-cavi--ai%2Ftap-FBB040?logo=homebrew&logoColor=white" alt="Homebrew tap cavi-ai/tap"></a>
  <a href="https://cavi-ai.xyz/docs"><img src="https://img.shields.io/badge/docs-cavi--ai.xyz-5B5BD6" alt="Documentation at cavi-ai.xyz"></a>
</p>

<p align="center">
  <a href="https://github.com/cavi-ai/companion-for-claude"><strong>Companion for Claude</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/cavi-ai/bobby-browser"><strong>Bobby Browser</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/cavi-ai/ableton-mcp"><strong>Ableton MCP</strong></a>
  &nbsp;·&nbsp;
  <a href="https://cavi-ai.xyz/docs"><strong>Documentation</strong></a>
</p>

---

## Start here

### Companion for Claude

[**Companion for Claude**](https://github.com/cavi-ai/companion-for-claude) brings Claude into your Obsidian vault: vault-aware chat, an agent mode whose edits you review hunk by hunk, sandboxed HTML artifacts, and evidence-backed research. The Obsidian Community Store release for Claude knowledge workflows. Connect with Claude Code, your own Anthropic key, or a local model.

<a href="https://github.com/cavi-ai/companion-for-claude"><img src="https://raw.githubusercontent.com/cavi-ai/companion-for-claude/main/assets/canvas-output.png" alt="Companion in Obsidian: onboarding interviews connected to a finding, proposal, and next research session beside Claude chat" width="100%"></a>

[**Install from the Obsidian store**](https://obsidian.md/plugins?id=claude-companion) · [**View source**](https://github.com/cavi-ai/companion-for-claude)

### Bobby Browser

[**Bobby Browser**](https://github.com/cavi-ai/bobby-browser) is an alpha browser-automation runtime for agents on Firefox and Chromium. Every call is authenticated, capability-scoped, journaled with evidence, and recoverable after a crash, through MCP, ACP, CDP, and SDKs for TypeScript, Python, and Rust.

[**Install**](https://github.com/cavi-ai/bobby-browser#install) · [**Documentation**](https://cavi-ai.xyz/docs/bobby-browser) · [**View source**](https://github.com/cavi-ai/bobby-browser)

### Ableton MCP

[**Ableton MCP**](https://github.com/cavi-ai/ableton-mcp) gives MCP clients local-first control of Ableton Live through a Remote Script bridge, a stdio MCP server, and a CLI with confirm-to-execute mutations: every change to the Live Set is planned first and runs only with a single-use confirmation.

[**Install**](https://github.com/cavi-ai/ableton-mcp#install) · [**View source**](https://github.com/cavi-ai/ableton-mcp)

---

## Install

| Product | Install |
| :-- | :-- |
| Companion for Claude | In Obsidian: **Settings → Community plugins → Browse**, search "Companion for Claude", or open the [store listing](https://obsidian.md/plugins?id=claude-companion). |
| Bobby Browser | `brew install cavi-ai/tap/bobby-browser` |
| Ableton MCP | `npm install -g @cavi-ai/ableton-mcp`, then `ableton-mcp install` |
| Secure Agent | Download the [macOS app](https://github.com/cavi-ai/secure-agent/releases/latest) (macOS 14 or later). |
| MCP Eval | `brew install cavi-ai/tap/mcpeval` |
| MLX Agent | `claude plugin marketplace add cavi-ai/mlx-agent`, then `claude plugin install mlx-agent@mlx-agent` |
| MLX Workbench | Download the [macOS app](https://github.com/cavi-ai/mlx-workbench/releases/latest) (Apple Silicon). |
| CAVI API Client | `npm install @cavi-ai/api-client` |
| CAVI Plugins | `claude plugin marketplace add cavi-ai/plugins` |
| Obsidian Agent | `/plugin marketplace add cavi-ai/obsidian-agent`, then `/plugin install obsidian-agent@obsidian-agent` in Claude Code |
| Antigravity for OpenClaw | `openclaw plugins install @cavi-ai/antigravity` |
| Loop Killer | `claude plugin marketplace add cavi-ai/plugins`, then `/plugin install loop-killer@cavi-ai` in Claude Code |
| Blender MCP | [Clone and install](https://github.com/cavi-ai/blender-mcp#install) with Blender, Python, and uv. |

---

## Explore the stack

Open building blocks for secure, local, and inspectable agent systems.

<table>
  <tr>
    <td width="50%"><a href="https://github.com/cavi-ai/secure-agent"><img src="https://raw.githubusercontent.com/cavi-ai/secure-agent/main/assets/screenshots/overview-dark.jpg" alt="Secure Agent overview with an access request, monitoring coverage and active sessions"></a></td>
    <td width="50%"><a href="https://github.com/cavi-ai/mlx-workbench"><img src="https://raw.githubusercontent.com/cavi-ai/mlx-workbench/main/docs/images/library.png" alt="MLX Workbench Library with the model inspector"></a></td>
  </tr>
  <tr>
    <td align="center"><sub>Secure Agent</sub></td>
    <td align="center"><sub>MLX Workbench</sub></td>
  </tr>
</table>

### Secure and evaluate agents

| Project | What it does |
| :-- | :-- |
| [**Secure Agent**](https://github.com/cavi-ai/secure-agent) | Local monitor for AI coding agents on macOS: sessions, processes, file activity, and network destinations. Optional guards can stop supported tool calls; an opt-in proxy inspects routed traffic for secret leaks. |
| [**MCP Eval**](https://github.com/cavi-ai/mcp-eval) | Evidence-driven MCP-server evaluation across discovery cost, schema guessability, error honesty, state recovery, and contention — turning agent friction into actionable findings. |

### Run local models on Apple Silicon

| Project | What it does |
| :-- | :-- |
| [**MLX Agent**](https://github.com/cavi-ai/mlx-agent) | Discovers, verifies, and wires local MLX-optimized models on Apple Silicon — Claude, Codex, Antigravity, OpenCode, and AgentSkills. |
| [**MLX Workbench**](https://github.com/cavi-ai/mlx-workbench) | Native macOS app for the MLX Agent model lifecycle: converts, verifies, compares, serves, and fine-tunes local models on Apple Silicon. |

### Connect and extend agent hosts

| Project | What it does |
| :-- | :-- |
| [**CAVI API Client**](https://github.com/cavi-ai/cavi-api-client) | Gateway-agnostic TypeScript client — agent runtime infrastructure for typed HTTP, WebSocket, and SSE. |
| [**CAVI Plugins**](https://github.com/cavi-ai/plugins) | Host-neutral plugin catalog across Claude, Codex, Agy, OpenCode, OpenClaw, Hermes, and AgentSkills. |
| [**Obsidian Agent**](https://github.com/cavi-ai/obsidian-agent) | Portable, CLI-powered Obsidian workflows across agent hosts. |
| [**Antigravity for OpenClaw**](https://github.com/cavi-ai/openclaw-antigravity) | OpenClaw provider plugin for Google's Antigravity CLI. |
| [**Loop Killer**](https://github.com/cavi-ai/loop-killer) | Claude Code plugin that ends stop-hook re-prompt loops: when replies to a re-prompting hook stop doing tool work, it clears the active goal and says so. |

### Create 3D and game assets

| Project | What it does |
| :-- | :-- |
| [**Blender MCP**](https://github.com/cavi-ai/blender-mcp) | Local-first MCP tools for Blender scene inspection, mesh editing, previews, and game asset export, through a bridge that binds to loopback and requires a session token. |

## Research and verification

- **Agent security** — recording what local agents read, run, and connect to, with guards you opt into.
- **Runtime interoperability** — connecting gateways and providers through typed boundaries.
- **Local-first workflows** — running models and knowledge tools on hardware you control.
- **MCP reliability** — measuring discovery cost, schema guessability, error honesty, state recovery, and contention.

## Built in the open

Every public CAVI-AI project ships with its source and provenance. Read the code, test the assumptions, adapt the tools, and contribute what you learn. More work is in development — we publish it when there is working software and evidence worth examining.

<p align="center">
  <a href="https://cavi-ai.xyz">cavi-ai.xyz</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/cavi-ai?tab=repositories">all repositories</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/cavi-ai/plugins">plugin catalog</a>
</p>

<p align="center"><sub>MIT licensed · Source published · Provenance attached</sub></p>
