# Nullshot Plugin

`plugins/nullshot/` is the canonical plugin bundle. Root client manifests must reference that directory instead of duplicating skills.

- Keep every MCP adapter pointed at `https://mcp.nullshot.ai/mcp`.
- Never commit bearer tokens, OAuth codes, client secrets, `.env`, or generated auth stores.
- Keep planning and context skills; do not add coding-discipline skills from Spek or Superpowers.
- Treat Nullshot Jam as the canonical specification and plan store.
- Prefer direct execution by the connected coding agent for explicit build requests. Use `send_jam_prompt` only for deliberate Nullshot-hosted delegation, and never start one implicitly after Jam creation. If hosted execution was not already requested, disclose its model usage and obtain explicit user acceptance before sending.
- Use `cp` or `cp -R` when importing upstream material, then adapt it in a separate patch.
- Run `pnpm test`, `pnpm validate`, the Codex plugin validator, and skill validation before release.
