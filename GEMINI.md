# Nullshot

Read and follow `@./plugins/nullshot/skills/using-nullshot/SKILL.md` at the beginning of Nullshot planning or operation work. Load the other skill named by that workflow before acting.

Use the `nullshot` MCP server for Jam state. Authenticate with `/mcp auth nullshot` if a tool reports that authorization is required. Keep the Jam specification and task DAG authoritative; do not create a disconnected local Spek plan.

For an explicit build request, prefer editing and committing the Jam app directly with the connected coding agent. Creating a Jam does not start a hosted prompt. Call `send_jam_prompt` only when the user deliberately chooses Nullshot-hosted execution. If direct execution is unavailable, disclose hosted model usage and obtain explicit user acceptance before sending; never fall back silently.
