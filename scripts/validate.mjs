import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonicalUrl = "https://mcp.nullshot.ai/mcp";
const requiredFiles = [
  ".agents/plugins/marketplace.json",
  ".claude-plugin/marketplace.json",
  ".cursor-plugin/plugin.json",
  ".kimi-plugin/plugin.json",
  ".mcp.json",
  ".opencode/plugins/nullshot.js",
  ".pi/extensions/nullshot.ts",
  "GEMINI.md",
  "gemini-extension.json",
  "kimi.plugin.json",
  "scripts/install-opencode.sh",
  "plugins/nullshot/.claude-plugin/plugin.json",
  "plugins/nullshot/.codex-plugin/plugin.json",
  "plugins/nullshot/.mcp.json",
];

for (const relative of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, relative)), `missing ${relative}`);
}

const jsonFiles = requiredFiles.filter((file) => file.endsWith(".json"));
for (const relative of jsonFiles) {
  JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
}

const codex = JSON.parse(fs.readFileSync(path.join(root, "plugins/nullshot/.codex-plugin/plugin.json"), "utf8"));
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
assert.equal(codex.name, "nullshot");
assert.equal(codex.version, pkg.version);
assert.equal(codex.mcpServers, "./.mcp.json");

const canonicalMcp = fs.readFileSync(path.join(root, "plugins/nullshot/.mcp.json"), "utf8");
assert.ok(canonicalMcp.includes(canonicalUrl));
assert.equal(
  fs.readFileSync(path.join(root, ".mcp.json"), "utf8"),
  canonicalMcp,
  "root and canonical MCP files drifted",
);
assert.equal(
  fs.readFileSync(path.join(root, ".kimi-plugin/plugin.json"), "utf8"),
  fs.readFileSync(path.join(root, "kimi.plugin.json"), "utf8"),
  "Kimi manifests drifted",
);

const skillRoot = path.join(root, "plugins/nullshot/skills");
const skillDirs = fs.readdirSync(skillRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
assert.deepEqual(
  skillDirs.map((entry) => entry.name).sort(),
  ["creating-nullshot-specs", "operating-nullshot", "shaping-nullshot-context", "using-nullshot", "writing-nullshot-plans"],
);
for (const entry of skillDirs) {
  const skillFile = path.join(skillRoot, entry.name, "SKILL.md");
  const agentFile = path.join(skillRoot, entry.name, "agents/openai.yaml");
  assert.ok(fs.existsSync(skillFile), `missing ${entry.name}/SKILL.md`);
  assert.ok(fs.existsSync(agentFile), `missing ${entry.name}/agents/openai.yaml`);
  const source = fs.readFileSync(skillFile, "utf8");
  assert.match(source, new RegExp(`^---\\nname: ${entry.name}\\n`, "m"));
  assert.ok(!source.includes("[TODO:"), `${entry.name} contains a TODO placeholder`);
}

const filesToScan = [
  ...requiredFiles,
  ...skillDirs.map((entry) => `plugins/nullshot/skills/${entry.name}/SKILL.md`),
  ...fs.readdirSync(path.join(root, "plugins/nullshot/commands")).map((file) => `plugins/nullshot/commands/${file}`),
];
for (const relative of filesToScan) {
  const source = fs.readFileSync(path.join(root, relative), "utf8");
  assert.ok(!source.includes("http://localhost:8787/mcp"), `${relative} references the retired local Spek MCP`);
  if (relative.endsWith(".json") || relative.endsWith(".js") || relative.endsWith(".ts")) {
    const embedsMcpUrl = /mcp\.nullshot\.ai|config\.mcp|NULLSHOT_SERVER/.test(source);
    if (embedsMcpUrl) assert.ok(source.includes(canonicalUrl), `${relative} does not use the canonical MCP URL`);
  }
}

console.log(`Validated Nullshot plugin ${pkg.version} with ${skillDirs.length} skills.`);
