const os = require("node:os");
const path = require("node:path");
const { defineConfig } = require("@vscode/test-cli");

// Use a short user-data-dir to avoid exceeding the 103-char Unix socket path
// limit on macOS, where the GitHub runner workspace path is already long.
const userDataDir = path.join(os.tmpdir(), "vsct-user-data");

module.exports = defineConfig({
  files: "out/**/*.test.js",
  launchArgs: ["--user-data-dir", userDataDir]
});
