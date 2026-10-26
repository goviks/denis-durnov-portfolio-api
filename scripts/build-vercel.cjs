const { cpSync, mkdirSync, rmSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const projectRoot = join(__dirname, "..");
const webSource = join(projectRoot, "web");
const outputDirectory = join(projectRoot, "dist", "vercel");
const apiUrl = (process.env.PORTFOLIO_API_URL || "").replace(/\/+$/, "");

if (apiUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(apiUrl);
  } catch (error) {
    throw new Error("PORTFOLIO_API_URL must be an absolute HTTP(S) URL.", {
      cause: error,
    });
  }

  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    throw new Error("PORTFOLIO_API_URL must use HTTP or HTTPS.");
  }
} else if (process.env.VERCEL === "1") {
  throw new Error(
    "Set PORTFOLIO_API_URL in Vercel to the deployed Render service URL.",
  );
}

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });
cpSync(webSource, outputDirectory, { recursive: true });
writeFileSync(
  join(outputDirectory, "config.js"),
  `window.PORTFOLIO_CONFIG = Object.freeze(${JSON.stringify({ apiUrl })});\n`,
);
console.log(
  `Vercel frontend built in dist/vercel${apiUrl ? ` for ${apiUrl}` : ""}.`,
);
