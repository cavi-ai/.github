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

### 02 · Local MLX on Apple Silicon

[**mlx-agent**](https://github.com/cavi-ai/mlx-agent) discovers, verifies, and wires local MLX-optimized models on Apple Silicon — a universal plugin for Claude, Codex, Gemini, and OpenCode, plus portable AgentSkills.

```sh
claude plugin marketplace add cavi-ai/mlx-agent
claude plugin install mlx-agent@mlx-agent
```

### 03 · Knowledge workflows

[**Companion for Claude**](https://github.com/cavi-ai/companion-for-claude) and [**claude-obsidian**](https://github.com/cavi-ai/claude-obsidian) form one local-first workflow: an Obsidian interface and MCP bridge paired with Claude Code commands for synthesis, drafting, tagging, session capture, and interactive artifacts.

```sh
/plugin marketplace add cavi-ai/claude-obsidian
```

## What we're testing

- **Runtime interoperability** across gateways and providers.
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
