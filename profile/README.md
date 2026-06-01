<h1 align="center">
  <img src="./logo-wordmark.png" alt="cavi-ai" width="460">
</h1>

<p align="center">
  <strong>Infrastructure and tools for building with agent runtimes.</strong><br>
  Gateway-agnostic clients, typed contracts, and graceful degradation — plus
  editor and CLI integrations that bring Claude into the tools you already use.
</p>

---

### Packages

| Package | What it does |
| --- | --- |
| [**@cavi-ai/api-client**](https://github.com/cavi-ai/cavi-api-client) | Gateway-agnostic TypeScript client: HTTP + WebSocket RPC, SSE, provider adapters (Hermes / OpenClaw), a runtime team manifest, React bindings, and graceful degradation as a contract. |

```sh
npm install @cavi-ai/api-client
```

### Plugins

| Plugin | What it does |
| --- | --- |
| [**Companion for Claude**](https://github.com/cavi-ai/companion-for-claude) | Obsidian plugin — chat with Claude using your notes as context, generate gallery-grade interactive HTML artifacts, switch models and extended thinking per message, with conversation history and offline local-model fallback. |
| [**claude-obsidian**](https://github.com/cavi-ai/claude-obsidian) | Claude Code plugin + marketplace — commands and skills that let Claude Code operate on your Obsidian vault (synthesis, tagging, drafting, session capture, artifacts, spec builds) over the Companion MCP bridge. |

```sh
# Claude Code plugin
/plugin marketplace add cavi-ai/claude-obsidian
```

The two plugins are a paired product: **Companion for Claude** runs a local MCP
bridge exposing your vault, and **claude-obsidian** connects Claude Code to it —
so both operate on the same notes. See the
[monorepo](https://github.com/cavi-ai/claude-obsidian) for both.

### Principles

- **One surface, many gateways.** The transport, RPC protocol, retry, and trace
  behavior are written once; providers override only what genuinely differs.
- **Contracts over conventions.** Route literals and surfaces live in owned
  files, and the package boundary is enforced by tests — not honor system.
- **Degrade, don't crash.** Loaders return typed fallback envelopes with a
  structured contract gap on backend failure, instead of taking down the page.
- **Open and verifiable.** MIT-licensed, pure ESM, published to npm with build
  provenance via OIDC trusted publishing.

---

<p align="center"><sub>MIT licensed · built by <a href="https://github.com/sasan1200">@sasan1200</a></sub></p>
