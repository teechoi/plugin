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
| Pi terminal | `pi install git:github.com/null-shot/plugin@v0.2.0` |

Cursor and Gemini discover OAuth automatically when the MCP server first returns `401 Unauthorized`. Kimi applies the plugin in a new session; if it reports that authorization is required, run `/mcp-config login plugin-nullshot:nullshot`. Pi exposes the equivalent interactive action as `/mcp-auth nullshot`.

## Choosing an environment

The plugin talks to production, `https://mcp.nullshot.ai/mcp`, unless
`NULLSHOT_MCP_URL` says otherwise:

```bash
export NULLSHOT_MCP_URL="https://mcp-gateway-test.devaccounts-1password.workers.dev/mcp"
```

Set it before the bootstrap command, and keep it set for the sessions that
should use that gateway. Nullshot runs separate production, test, preview and
local gateways, and each has its own accounts, jams and grants — so an agent
pointed at the wrong one reads and writes the wrong environment's data while
appearing to work normally. Production stays the default, so an existing
install is unaffected by this.

Claude Code reads it through its plugin manifest, where `${VAR:-default}`
expansion is supported for an HTTP server's `url`. The OpenCode and Pi adapters
resolve it in code.

Codex, Cursor, Kimi and Gemini are **production-only**. Codex reads
`plugins/nullshot/.mcp.json` and does not expand `${VAR}` in MCP configuration
(`openai/codex#2680` and `#7521` are open requests for it), so that file stays a
plain URL on purpose: an unexpanded `${...}` there would register a broken
server, which is worse than one that cannot change environment. The Cursor,
Kimi and Gemini manifests have no expansion support I could verify either.

## Workflow

1. Authenticate and select a Jam with `set_active_jam_context`.
2. Use `using-nullshot` to load Jam context and relevant remote skills.
3. Shape the product intent with `shaping-nullshot-context` and `creating-nullshot-specs`.
4. Write the reviewed task DAG with `writing-nullshot-plans`; the goal and tasks are replaced atomically using revision checks.
5. Use `operating-nullshot` for explicit build work. The connected coding agent edits and commits the Jam app directly by default; `send_jam_prompt` is an optional hosted-delegation path.

Creating a Jam never starts a hosted prompt. A clear request to build, implement, fix, or create an app or feature carries execution authorization through spec and plan, so the coding agent does not ask for a redundant second start message. Planning-only requests still stop before implementation. Direct execution avoids additional Nullshot-hosted agent usage but may use the coding client's own model subscription or API budget.

For example, “create a todo app” creates a prompt-free Jam in planning, synchronizes the specification and task DAG, then has the connected coding agent edit and commit the Jam app. The agent marks each plan task in progress and complete through the MCP so the Spek visualization stays current. It calls `send_jam_prompt` only if hosted execution is deliberately selected.

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
