const { cpSync, mkdirSync, rmSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { PrismaClient } = require("@prisma/client");

const projectRoot = join(__dirname, "..");
const webSource = join(projectRoot, "web");
const outputDirectory = join(projectRoot, "dist", "pages");
const prisma = new PrismaClient();

async function buildPages() {
  const profile = await prisma.profile.findUnique({
    where: { id: "denis-durnov" },
    include: {
      links: true,
      skills: true,
      experience: true,
      projects: true,
    },
  });

  if (!profile) {
    throw new Error(
      "Cannot build GitHub Pages: the seeded profile was not found.",
    );
  }

  const staticProfile = {
    name: profile.name,
    description: profile.description,
    links: profile.links.map(({ label, url }) => ({ label, url })),
    skills: profile.skills.map(({ name }) => ({ name })),
    experience: profile.experience.map((item) => {
      let achievements;
      try {
        achievements = JSON.parse(item.achievements);
      } catch (error) {
        throw new Error(
          `Cannot build GitHub Pages: achievements for "${item.company}" are invalid JSON.`,
          { cause: error },
        );
      }

      if (
        !Array.isArray(achievements) ||
        !achievements.every((achievement) => typeof achievement === "string")
      ) {
        throw new Error(
          `Cannot build GitHub Pages: achievements for "${item.company}" are not a string array.`,
        );
      }

      return {
        company: item.company,
        position: item.position,
        period: item.period,
        achievements,
      };
    }),
    projects: profile.projects.map(({ name, description, url, demoUrl }) => ({
      name,
      description,
      url,
      demoUrl,
    })),
  };

  rmSync(outputDirectory, { recursive: true, force: true });
  mkdirSync(outputDirectory, { recursive: true });
  cpSync(webSource, outputDirectory, { recursive: true });
  writeFileSync(
    join(outputDirectory, "config.js"),
    'window.PORTFOLIO_CONFIG = Object.freeze({ apiUrl: "", profileUrl: "profile.json" });\n',
  );
  writeFileSync(
    join(outputDirectory, "profile.json"),
    `${JSON.stringify({ profile: staticProfile }, null, 2)}\n`,
  );
  console.log("GitHub Pages site built in dist/pages.");
}

buildPages()
  .catch((error) => {
    console.error("Failed to build GitHub Pages site:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
