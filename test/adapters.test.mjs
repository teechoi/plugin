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

test("OpenCode adapter supports the managed global install layout", () => {
  const adapter = fs.readFileSync(path.resolve(".opencode/plugins/nullshot.js"), "utf8");
  assert.match(adapter, /nullshot-plugin/);
  const installer = fs.readFileSync(path.resolve("scripts/install-opencode.sh"), "utf8");
  assert.match(installer, /cp "\$plugin_root\/\.opencode\/plugins\/nullshot\.js"/);
  assert.match(installer, /opencode mcp auth nullshot/);
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
