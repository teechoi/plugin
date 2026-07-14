# Nullshot Plugin

Plan, inspect, and operate [Nullshot](https://nullshot.ai) from your coding agent. The plugin connects to Nullshot's OAuth-protected MCP gateway at `https://mcp.nullshot.ai/mcp`, loads planning skills derived from Spek Kit, and keeps specifications and task DAGs live in a Nullshot Jam.

## One-command bootstrap

Paste the command for your client as one line. Clients with terminal OAuth support open the Nullshot login during the command; the others request OAuth when Nullshot is first used.

| Client | Paste once |
| --- | --- |
| Codex terminal | `codex plugin marketplace add null-shot/plugin && codex plugin add nullshot@nullshot && codex mcp login nullshot` |
| Claude Code terminal | `claude plugin marketplace add null-shot/plugin && claude plugin install nullshot@nullshot && claude mcp login plugin:nullshot:nullshot` |
| Cursor chat | `/add-plugin https://github.com/null-shot/plugin` |
| Kimi chat | `/plugins install https://github.com/null-shot/plugin` |
| Gemini terminal | `gemini extensions install https://github.com/null-shot/plugin --consent` |
| OpenCode terminal | `curl -fsSL https://raw.githubusercontent.com/null-shot/plugin/main/scripts/install-opencode.sh \| sh` |
| Pi terminal | `pi install git:github.com/null-shot/plugin@v0.1.0` |

Cursor and Gemini discover OAuth automatically when the MCP server first returns `401 Unauthorized`. Kimi applies the plugin in a new session; if it reports that authorization is required, run `/mcp-config login nullshot`. Pi exposes the equivalent interactive action as `/mcp-auth nullshot`.

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
