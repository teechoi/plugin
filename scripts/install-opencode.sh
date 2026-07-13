#!/bin/sh
set -eu

config_root="${XDG_CONFIG_HOME:-$HOME/.config}/opencode"
plugin_root="$config_root/nullshot-plugin"
source_url="${NULLSHOT_PLUGIN_SOURCE:-https://github.com/null-shot/plugin.git}"
ref="${NULLSHOT_PLUGIN_REF:-main}"

if [ -d "$plugin_root/.git" ]; then
  git -C "$plugin_root" pull --ff-only
else
  git clone --depth 1 --branch "$ref" "$source_url" "$plugin_root"
fi

mkdir -p "$config_root/plugins"
cp "$plugin_root/.opencode/plugins/nullshot.js" "$config_root/plugins/nullshot.js"

printf '%s\n' 'Nullshot installed for OpenCode.' 'Run: opencode mcp auth nullshot'
