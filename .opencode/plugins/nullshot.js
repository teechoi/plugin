import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const adapterDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(adapterDir, "../..");
const managedRoot = path.resolve(adapterDir, "../nullshot-plugin");
const pluginRoot = fs.existsSync(path.join(projectRoot, "plugins/nullshot/skills"))
  ? projectRoot
  : managedRoot;
const skillsDir = path.join(pluginRoot, "plugins/nullshot/skills");
let bootstrap;

function readBootstrap() {
  if (bootstrap !== undefined) return bootstrap;
  const file = path.join(skillsDir, "using-nullshot/SKILL.md");
  bootstrap = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  return bootstrap;
}

export const NullshotPlugin = async () => ({
  config: async (config) => {
    config.skills ??= {};
    config.skills.paths ??= [];
    if (!config.skills.paths.includes(skillsDir)) config.skills.paths.push(skillsDir);
    config.mcp ??= {};
    config.mcp.nullshot = {
      type: "remote",
      url: "https://mcp.nullshot.ai/mcp",
      enabled: true,
    };
  },
  "experimental.chat.messages.transform": async (_input, output) => {
    const content = readBootstrap();
    const firstUser = output.messages.find((message) => message.info.role === "user");
    if (!content || !firstUser?.parts?.length) return;
    if (firstUser.parts.some((part) => part.type === "text" && part.text.includes("<NULLSHOT_PLUGIN>"))) return;
    const ref = firstUser.parts[0];
    firstUser.parts.unshift({ ...ref, type: "text", text: `<NULLSHOT_PLUGIN>\n${content}\n</NULLSHOT_PLUGIN>` });
  },
});
