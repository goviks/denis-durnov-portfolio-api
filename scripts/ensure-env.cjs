const { copyFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");

const projectRoot = join(__dirname, "..");
const envFile = join(projectRoot, ".env");
const envTemplate = join(projectRoot, ".env.example");

if (!existsSync(envFile)) {
  copyFileSync(envTemplate, envFile);
  console.log("Created .env from .env.example");
}
