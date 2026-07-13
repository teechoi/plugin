import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import mcpAdapter from "pi-mcp-adapter";

const NULLSHOT_SERVER = {
  url: "https://mcp.nullshot.ai/mcp",
  auth: "oauth",
  oauth: {
    clientName: "Nullshot Plugin for Pi",
    clientUri: "https://github.com/null-shot/plugin",
    scope: "docs:read brainstorms:read jams:read rooms:read code:read ops:read brainstorms:write jams:write code:write prompts:send merge:write publish:write",
  },
  lifecycle: "lazy",
};

function ensureNullshotConfig() {
  const agentDir = process.env.PI_CODING_AGENT_DIR || path.join(os.homedir(), ".pi", "agent");
  const configPath = path.join(agentDir, "mcp.json");
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  let config: Record<string, unknown> = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch (error) {
      throw new Error(`Cannot install Nullshot MCP into invalid Pi config ${configPath}: ${String(error)}`);
    }
  }
  const servers = (config.mcpServers && typeof config.mcpServers === "object")
    ? config.mcpServers as Record<string, unknown>
    : {};
  const existing = servers.nullshot as { url?: string } | undefined;
  if (existing?.url && existing.url !== NULLSHOT_SERVER.url) {
    throw new Error(`Pi already has a conflicting nullshot MCP URL in ${configPath}.`);
  }
  const next = { ...config, mcpServers: { ...servers, nullshot: NULLSHOT_SERVER } };
  const serialized = `${JSON.stringify(next, null, 2)}\n`;
  if (!fs.existsSync(configPath) || fs.readFileSync(configPath, "utf8") !== serialized) {
    fs.writeFileSync(configPath, serialized, { mode: 0o600 });
  }
}

export default function nullshot(pi: ExtensionAPI) {
  ensureNullshotConfig();
  mcpAdapter(pi);
}
