const { cpSync, mkdirSync, readdirSync, rmSync, statSync } = require("node:fs");
const { join } = require("node:path");

const projectRoot = join(__dirname, "..");
const webSource = join(projectRoot, "web");
const webOutput = join(projectRoot, "dist", "web");

rmSync(webOutput, { recursive: true, force: true });
mkdirSync(webOutput, { recursive: true });

for (const entry of readdirSync(webSource)) {
  const sourcePath = join(webSource, entry);
  const targetPath = join(webOutput, entry);
  const isDirectory = statSync(sourcePath).isDirectory();

  cpSync(sourcePath, targetPath, {
    recursive: isDirectory,
    force: true,
  });
}
