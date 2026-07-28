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

### 02 · Secure browser automation

[**bobby-browser**](https://github.com/cavi-ai/bobby-browser) is an alpha browser automation runtime with authenticated, capability-scoped control surfaces across Rust, TypeScript, MCP, and CDP. Its adapters share the same authorization, evidence, checkpoint, and event contracts.

### 03 · Local AI on Apple Silicon

[**mlx-agent**](https://github.com/cavi-ai/mlx-agent) discovers, verifies, and wires local MLX-optimized models on Apple Silicon — a universal plugin for Claude, Codex, Gemini, and OpenCode, plus portable AgentSkills.

Find it in the shared [**CAVI plugins catalog**](https://github.com/cavi-ai/plugins), with installation paths for Claude, Codex, Gemini, OpenCode, and AgentSkills.

### 04 · Knowledge workflows

[**obsidian-agent**](https://github.com/cavi-ai/obsidian-agent) brings portable vault workflows to agent hosts through the official Obsidian CLI. Its cross-host skills run with Claude, Codex, Gemini, OpenCode, and AgentSkills. It has no MCP dependency and does not require an Obsidian community plugin.

Discover it alongside `mlx-agent` in [**cavi-ai/plugins**](https://github.com/cavi-ai/plugins), the shared catalog for CAVI's installable agent extensions.

[**Companion for Claude**](https://github.com/cavi-ai/companion-for-claude) remains a separate specialized product: an Obsidian community experience for Claude workflows. It is not required by `obsidian-agent`.

## What we're testing

- **Runtime interoperability** across gateways and providers.
- **Secure browser control** through authenticated, capability-scoped automation surfaces.
- **Contracts over conventions** through typed boundaries and executable checks.
- **Graceful degradation** that returns structured gaps instead of hiding failure.
- **Local-first workflows** that keep developers close to their own knowledge and tools.
- **On-device model wiring** that matches MLX models to Apple Silicon hosts and agent configs.

## Built in the open

Our public work is released under the MIT license. Read the code, test the assumptions, adapt the tools, and contribute what you learn.

More work is in development. We publish it when there is working software and evidence worth examining.

<p align="center">
  <a href="https://cavi-ai.xyz">cavi-ai.xyz</a> ·
  <a href="https://github.com/cavi-ai?tab=repositories">repositories</a>
</p>
