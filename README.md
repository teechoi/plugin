# Nullshot Plugin

Plan, inspect, and operate [Nullshot](https://nullshot.ai) from your coding agent. The plugin connects to Nullshot's OAuth-protected MCP gateway at `https://mcp.nullshot.ai/mcp`, loads planning skills derived from Spek Kit, and keeps specifications and task DAGs live in a Nullshot Jam.

## Install

| Client | Install | Authenticate |
| --- | --- | --- |
| Codex | `codex plugin marketplace add null-shot/plugin` then `codex plugin add nullshot@nullshot` | `codex mcp login nullshot` |
| Claude Code | `claude plugin marketplace add null-shot/plugin` then `claude plugin install nullshot@nullshot` | OAuth starts on first MCP use |
| Cursor | Run `/add-plugin https://github.com/null-shot/plugin` | OAuth starts on first MCP use |
| Kimi | Run `/plugins install https://github.com/null-shot/plugin`, then `/reload` | `/mcp-config login nullshot` |
| Gemini CLI | `gemini extensions install https://github.com/null-shot/plugin` | `/mcp auth nullshot` |
| OpenCode | `curl -fsSL https://raw.githubusercontent.com/null-shot/plugin/main/scripts/install-opencode.sh \| sh` | `opencode mcp auth nullshot` |
| Pi | `pi install git:github.com/null-shot/plugin@v0.1.0` | `/mcp-auth nullshot` |

Restart the client or begin a new conversation after installation so it discovers the new skills and MCP tools.

## Workflow

1. Authenticate and select a Jam with `set_active_jam_context`.
2. Use `using-nullshot` to load Jam context and relevant remote skills.
3. Shape the product intent with `shaping-nullshot-context` and `creating-nullshot-specs`.
4. Write the reviewed task DAG with `writing-nullshot-plans`; the goal and tasks are replaced atomically using revision checks.
5. Use `operating-nullshot` only when the user explicitly asks to start a build, edit code, merge, or publish.

The plugin does not ship coding-method skills or a local Spek visualization server. Nullshot Jam is the source of truth for the live specification and plan.

## Repository layout

- `plugins/nullshot/` is the canonical Codex and Claude plugin bundle.
- Root manifests adapt that bundle for Cursor, Kimi, Gemini, OpenCode, and Pi.
- `scripts/validate.mjs` verifies manifests, paths, skills, and the canonical MCP URL.

## Development

```bash
pnpm install
pnpm test
pnpm validate
```

See [NOTICE](NOTICE) for Spek Kit, Spec Kit, Superpowers, and Pi MCP adapter attribution.
