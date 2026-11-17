<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./banner-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="./banner-light.png">
  <img src="./banner-light.png" alt="CAVI-AI — open research and infrastructure for agent systems">
</picture>

<h2 align="center">Open research and infrastructure for agent systems.</h2>

<p align="center">MIT-licensed MCP servers, Claude and Obsidian plugins, browser automation, and local MLX models: tools that make agent runtimes easier to connect, inspect, secure, and trust.</p>

<p align="center">
  <a href="https://github.com/cavi-ai/.github/blob/main/metrics/release-downloads.json"><img src="https://img.shields.io/badge/dynamic/json?label=GitHub%20release%20asset%20downloads&amp;query=%24.total&amp;url=https%3A%2F%2Fraw.githubusercontent.com%2Fcavi-ai%2F.github%2Fmain%2Fmetrics%2Frelease-downloads.json" alt="GitHub release asset downloads across CAVI repositories"></a>
  <a href="https://github.com/cavi-ai/homebrew-tap"><img src="https://img.shields.io/badge/brew%20tap-cavi--ai%2Ftap-FBB040?logo=homebrew&logoColor=white" alt="Homebrew tap cavi-ai/tap"></a>
  <a href="https://cavi-ai.xyz/docs"><img src="https://img.shields.io/badge/docs-cavi--ai.xyz-5B5BD6" alt="Documentation at cavi-ai.xyz"></a>
  <a href="https://huggingface.co/cavi-ai"><img src="https://img.shields.io/badge/Hugging%20Face-cavi--ai-FFD21E?logo=huggingface&logoColor=000" alt="CAVI-AI models on Hugging Face"></a>
</p>

<p align="center">
  <a href="https://github.com/cavi-ai/companion-for-claude"><strong>Companion for Claude</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/cavi-ai/bobby-browser"><strong>Bobby Browser</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/cavi-ai/ableton-mcp"><strong>Ableton MCP</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/cavi-ai/cavi-api-client"><strong>CAVI API Client</strong></a>
  &nbsp;·&nbsp;
  <a href="#creative-apps"><strong>Creative apps</strong></a>
  &nbsp;·&nbsp;
  <a href="#models-on-hugging-face"><strong>Models</strong></a>
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

**First result:** fill a form you control, inspect failed-field evidence, then
submit separately and check its saved result.
[Try the controlled-form workflow](https://github.com/cavi-ai/bobby-browser#try-a-controlled-form)
or [watch the walkthrough](https://github.com/cavi-ai/bobby-browser/blob/main/assets/form-walkthrough.mp4).

```sh
brew install cavi-ai/tap/bobby-browser
```

[**Install options**](https://github.com/cavi-ai/bobby-browser#install) · [**Documentation**](https://cavi-ai.xyz/docs/bobby-browser) · [**View source**](https://github.com/cavi-ai/bobby-browser)

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

**Try one material choice:** [recreate a Painter roughness revision](https://github.com/cavi-ai/substance-mcp/blob/main/examples/painter/uniform-fill-revision/README.md)
with the original mesh and maps, or [trace a two-material FBX into Painter](https://github.com/cavi-ai/blender-mcp/blob/main/examples/material-texture-sets/README.md).

<!-- catalog:products exclude="bobby-browser,companion-for-claude" -->
### Creative apps

| Project | What it does | Install |
| :-- | :-- | :-- |
| [**Substance MCP**](https://github.com/cavi-ai/substance-mcp) | Local-first MCP servers for Adobe Substance 3D Painter, Designer and Sampler, with SHA-256 receipts across all three. | `uv tool install cavi-substance-mcp` · [Install guide](https://cavi-ai.xyz/products/substance-mcp/) |
| [**Blender MCP**](https://github.com/cavi-ai/blender-mcp) | Local-first MCP tools for Blender scene inspection, mesh editing, previews and game asset export. | `uv tool install cavi-blender-mcp` · [Install guide](https://cavi-ai.xyz/products/blender-mcp/) |
| [**Premiere MCP**](https://github.com/cavi-ai/premiere-mcp) | 42 typed tools for Premiere Pro on macOS that cut a clip list into a ProRes 422 HQ master. | `uv tool install cavi-premiere-mcp` · [Install guide](https://cavi-ai.xyz/products/premiere-mcp/) |
| [**After Effects MCP**](https://github.com/cavi-ai/after-effects-mcp) | 45 tools for headless After Effects on macOS, with aerender renders checked frame by frame. | `uv tool install cavi-after-effects-mcp` · [Install guide](https://cavi-ai.xyz/products/after-effects-mcp/) |
| [**Godot MCP**](https://github.com/cavi-ai/godot-mcp) | Inspect GLB models in Godot, review materials and animation poses, and explore assets in an interactive 3D viewer. | `uv tool install cavi-godot-mcp` · [Install guide](https://cavi-ai.xyz/products/godot-mcp/) |
| [**Ableton MCP**](https://github.com/cavi-ai/ableton-mcp) | Local-first Ableton Live control for MCP clients, with every change to the Set planned first and confirmed once. | `npm install -g @cavi-ai/ableton-mcp` · [Install guide](https://cavi-ai.xyz/products/ableton-mcp/) |
| [**Adobe MCP**](https://github.com/cavi-ai/adobe-mcp) | MCP tools for Photoshop, Illustrator, Animate, Character Animator and Dimension on macOS. | `uv tool install cavi-adobe-mcp` · [Install guide](https://cavi-ai.xyz/products/adobe-mcp/) |

### Obsidian

| Project | What it does | Install |
| :-- | :-- | :-- |
| [**Obsidian Agent**](https://github.com/cavi-ai/obsidian-agent) | Portable, CLI-powered Obsidian workflows packaged for Claude, Codex, Gemini, OpenCode, and AgentSkills. | `/plugin marketplace add cavi-ai/obsidian-agent` · [Install guide](https://cavi-ai.xyz/products/obsidian-agent/) |

### Local models

| Project | What it does | Install |
| :-- | :-- | :-- |
| [**MLX Workbench**](https://github.com/cavi-ai/mlx-workbench) | Native macOS app for converting, verifying, serving and comparing local MLX models. | [Install guide](https://cavi-ai.xyz/products/mlx-workbench/) |
| [**MLX Agent**](https://github.com/cavi-ai/mlx-agent) | Discover, adopt, and safely wire local MLX models on Apple Silicon. | [Install guide](https://cavi-ai.xyz/products/mlx-agent/) |

### Secure and evaluate

| Project | What it does | Install |
| :-- | :-- | :-- |
| [**Secure Agent**](https://github.com/cavi-ai/secure-agent) | Local agent session monitoring and optional guards for file access and secret leaks. | [Install guide](https://cavi-ai.xyz/products/secure-agent/) |
| [**MCP Eval**](https://github.com/cavi-ai/mcp-eval) | Measure the operational cost MCP servers impose on agents and turn repeated friction into queryable findings. | `brew install cavi-ai/tap/mcpeval` · [Install guide](https://cavi-ai.xyz/products/mcp-eval/) |

### Build integrations

| Project | What it does | Install |
| :-- | :-- | :-- |
| [**API Client**](https://github.com/cavi-ai/cavi-api-client) | Typed HTTP, WebSocket, and SSE surfaces for compatible agent runtimes, with versioned reference documentation. | `npm install @cavi-ai/api-client` · [Install guide](https://cavi-ai.xyz/products/api-client/) |
| [**MCP Core**](https://github.com/cavi-ai/mcp-core) | Build Python MCP servers with typed results, compact schemas and structured failures. | `uv add cavi-mcp-core` · [Install guide](https://cavi-ai.xyz/products/mcp-core/) |
| [**Agent Sessions**](https://github.com/cavi-ai/agent-sessions) | Specialized workers, queued handoffs and leaner startup context for complex agent workflows. | `uv tool install git+https://github.com/cavi-ai/agent-sessions.git` · [Install guide](https://cavi-ai.xyz/products/agent-sessions/) |

### Host plugins

| Project | What it does | Install |
| :-- | :-- | :-- |
| [**CAVI Plugins**](https://github.com/cavi-ai/plugins) | Preview. One installation catalog for CAVI agent plugins and skills, per host. | `claude plugin marketplace add cavi-ai/plugins` · [Install guide](https://cavi-ai.xyz/products/plugins/) |
| [**Antigravity**](https://github.com/cavi-ai/openclaw-antigravity) | Connect OpenClaw to Google's Antigravity CLI (agy) as a subscription-backed model provider. | `openclaw plugins install @cavi-ai/antigravity` · [Install guide](https://cavi-ai.xyz/products/antigravity/) |
| [**Loop Killer**](https://github.com/cavi-ai/loop-killer) | Claude Code plugin that ends stop-hook re-prompt loops by clearing the active goal. | `/plugin install loop-killer@cavi-ai` · [Install guide](https://cavi-ai.xyz/products/loop-killer/) |
<!-- /catalog:products -->

## Models on Hugging Face

MLX conversions for Apple Silicon and a page-control detector, published at [huggingface.co/cavi-ai](https://huggingface.co/cavi-ai). Each model card names its base model, the exact source revision, its contents and its requirements.

<!-- catalog:models -->
| Model | What it does | Download |
| :-- | :-- | :-- |
| [`cavi-ai/Qwen3-VL-8B-Instruct-MLX-4bit`](https://huggingface.co/cavi-ai/Qwen3-VL-8B-Instruct-MLX-4bit) | Vision-language. MLX 4-bit. GUI grounding · English. Base model [`Qwen/Qwen3-VL-8B-Instruct`](https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct). | `hf download cavi-ai/Qwen3-VL-8B-Instruct-MLX-4bit` |
| [`cavi-ai/bobby-control-detector`](https://huggingface.co/cavi-ai/bobby-control-detector) | Object detection. safetensors + ONNX. Base model [`PekingU/rtdetr_v2_r18vd`](https://huggingface.co/PekingU/rtdetr_v2_r18vd). | `hf download cavi-ai/bobby-control-detector` |
| [`cavi-ai/Audio8-ASR-Infinite-MLX-8bit`](https://huggingface.co/cavi-ai/Audio8-ASR-Infinite-MLX-8bit) | Speech recognition. MLX 8-bit. Streaming · English, Mandarin. Base model [`Edge0/Audio8-ASR-Infinite`](https://huggingface.co/Edge0/Audio8-ASR-Infinite). | `hf download cavi-ai/Audio8-ASR-Infinite-MLX-8bit` |
| [`cavi-ai/Audio8-ASR-Infinite-MLX-4bit`](https://huggingface.co/cavi-ai/Audio8-ASR-Infinite-MLX-4bit) | Speech recognition. MLX 4-bit. Streaming · English, Mandarin. Base model [`Edge0/Audio8-ASR-Infinite`](https://huggingface.co/Edge0/Audio8-ASR-Infinite). | `hf download cavi-ai/Audio8-ASR-Infinite-MLX-4bit` |
| [`cavi-ai/laya-MLX-8bit`](https://huggingface.co/cavi-ai/laya-MLX-8bit) | Text classification. MLX 8-bit. Routing, moderation · English, multilingual. Base model [`convaiinnovations/laya`](https://huggingface.co/convaiinnovations/laya). | `hf download cavi-ai/laya-MLX-8bit` |
<!-- /catalog:models -->

## Built in the open

Every public CAVI-AI project ships with its source. Read the code, test the assumptions, adapt the tools, and contribute what you learn. More work is in development — we publish it when there is working software and evidence worth examining.

<p align="center">
  <a href="https://cavi-ai.xyz">cavi-ai.xyz</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/cavi-ai?tab=repositories">all repositories</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/cavi-ai/plugins">plugin catalog</a>
  &nbsp;·&nbsp;
  <a href="https://huggingface.co/cavi-ai">models</a>
</p>

<p align="center"><sub>MIT licensed · Source published</sub></p>
