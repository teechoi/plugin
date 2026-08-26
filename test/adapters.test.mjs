import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { NullshotPlugin } from "../.opencode/plugins/nullshot.js";

test("OpenCode adapter registers canonical skills and OAuth MCP", async () => {
  const hooks = await NullshotPlugin({});
  const config = {};
  await hooks.config(config);
  assert.ok(config.skills.paths.some((entry) => entry.endsWith("plugins/nullshot/skills")));
  assert.deepEqual(config.mcp.nullshot, {
    type: "remote",
    url: "https://mcp.nullshot.ai/mcp",
    enabled: true,
  });
});

test("OpenCode adapter points at the gateway named by NULLSHOT_MCP_URL", async () => {
  // Nullshot runs production, test, preview and local gateways. A hardcoded URL
  // meant anyone on a non-production environment pointed a write-scoped agent
  // at production data while believing otherwise.
  const previous = process.env.NULLSHOT_MCP_URL;
  process.env.NULLSHOT_MCP_URL = "https://mcp-gateway-test.example.workers.dev/mcp";
  try {
    // The module caches its resolved URL at import time, so re-import fresh.
    const { NullshotPlugin: Fresh } = await import(
      `../.opencode/plugins/nullshot.js?override=${Date.now()}`
    );
    const config = {};
    await (await Fresh({})).config(config);
    assert.equal(config.mcp.nullshot.url, "https://mcp-gateway-test.example.workers.dev/mcp");
  } finally {
    if (previous === undefined) delete process.env.NULLSHOT_MCP_URL;
    else process.env.NULLSHOT_MCP_URL = previous;
  }
});

test("manifests express the gateway as an overridable value, not a bare literal", () => {
  // The canonical-URL check elsewhere is satisfied by the default alone, so
  // this is what actually keeps the override from being edited away.
  const overridable = "${NULLSHOT_MCP_URL:-https://mcp.nullshot.ai/mcp}";
  for (const relative of [
    ".mcp.json",
    "plugins/nullshot/.mcp.json",
    "plugins/nullshot/.claude-plugin/plugin.json",
  ]) {
    assert.ok(
      fs.readFileSync(path.resolve(relative), "utf8").includes(overridable),
      `${relative} must express the gateway as ${overridable}`,
    );
  }
  for (const relative of [".opencode/plugins/nullshot.js", ".pi/extensions/nullshot.ts"]) {
    assert.match(fs.readFileSync(path.resolve(relative), "utf8"), /NULLSHOT_MCP_URL/);
  }
});

test("OpenCode adapter supports the managed global install layout", () => {
  const adapter = fs.readFileSync(path.resolve(".opencode/plugins/nullshot.js"), "utf8");
  assert.match(adapter, /nullshot-plugin/);
  const installer = fs.readFileSync(path.resolve("scripts/install-opencode.sh"), "utf8");
  assert.match(installer, /cp "\$plugin_root\/\.opencode\/plugins\/nullshot\.js"/);
  assert.match(installer, /opencode mcp auth nullshot/);
  assert.match(installer, /NULLSHOT_SKIP_AUTH/);
});

test("README exposes one pasteable bootstrap command per client", () => {
  const readme = fs.readFileSync(path.resolve("README.md"), "utf8");
  for (const client of ["Codex terminal", "Claude Code terminal", "Cursor chat", "Kimi chat", "Gemini terminal", "OpenCode terminal", "Pi terminal"]) {
    const row = readme.split("\n").find((line) => line.startsWith(`| ${client} |`));
    assert.ok(row, `missing bootstrap row for ${client}`);
    assert.equal((row.match(/`/g) ?? []).length, 2, `${client} bootstrap must be one inline command`);
    assert.ok(!/\bthen\b/i.test(row), `${client} bootstrap must not require a second step`);
  }
  assert.match(readme, /claude mcp login plugin:nullshot:nullshot/);
  assert.match(readme, /mcp-config login plugin-nullshot:nullshot/);
  assert.match(readme, /“create a todo app” creates a prompt-free Jam/);
  assert.match(readme, /Spek visualization stays current/);
});

test("skills prefer direct execution without removing hosted delegation", () => {
  const readSkill = (name) => fs.readFileSync(path.resolve(`plugins/nullshot/skills/${name}/SKILL.md`), "utf8");
  const using = readSkill("using-nullshot");
  const specs = readSkill("creating-nullshot-specs");
  const plans = readSkill("writing-nullshot-plans");
  const operating = readSkill("operating-nullshot");

  assert.match(using, /create_jam_room.*with no prompt/);
  assert.match(using, /Direct execution — default for explicit build work/);
  assert.match(using, /Hosted delegation/);
  assert.match(using, /obtain explicit user acceptance before sending/);
  assert.match(using, /Planning only.*do not authorize implementation/s);
  assert.match(specs, /original request as authorization/);
  assert.match(specs, /planning-only work, obtain explicit approval/);
  assert.match(plans, /do not ask for a redundant second start message/);
  assert.match(plans, /For planning-only requests, leave the room in planning and stop/);
  assert.match(operating, /Direct — default/);
  assert.match(operating, /Do not call `send_jam_prompt`/);
  assert.match(operating, /plan task's `todoId` with `update_jam_todo`/);
  assert.match(operating, /Spek visualization stays accurate/);
  assert.match(operating, /Hosted — deliberate delegation/);
  assert.match(operating, /never fall back silently/);
  assert.match(operating, /avoidance of additional Nullshot-hosted agent usage/);
  for (const operation of [
    'apply_merge_resolution',
    'apply_merge_user_choice',
    'stage_merge_user_choice',
    'clear_merge_user_choice',
    'discard_merge_resolution',
    'apply_selected_merge_features',
    'abort_merge',
    'undo_merge',
    'perform_publish',
  ]) {
    assert.ok(operating.includes(`\`${operation}\``), `missing confirmation guard for ${operation}`);
  }
});

test("Pi adapter preserves config and refuses a conflicting Nullshot URL", () => {
  const source = fs.readFileSync(path.resolve(".pi/extensions/nullshot.ts"), "utf8");
  assert.match(source, /\.\.\.config, mcpServers: \{ \.\.\.servers, nullshot: NULLSHOT_SERVER \}/);
  assert.match(source, /existing\.url !== NULLSHOT_SERVER\.url/);
  assert.match(source, /https:\/\/mcp\.nullshot\.ai\/mcp/);
  assert.ok(os.homedir());
});

test("canonical and client adapter manifests remain synchronized", () => {
  assert.equal(
    fs.readFileSync(path.resolve(".mcp.json"), "utf8"),
    fs.readFileSync(path.resolve("plugins/nullshot/.mcp.json"), "utf8"),
  );
  assert.equal(
    fs.readFileSync(path.resolve("kimi.plugin.json"), "utf8"),
    fs.readFileSync(path.resolve(".kimi-plugin/plugin.json"), "utf8"),
  );
});
