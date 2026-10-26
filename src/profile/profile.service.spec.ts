import { PrismaService } from "../prisma/prisma.service";
import { ProfileService } from "./profile.service";

describe("ProfileService", () => {
  it("loads the profile with all related collections", async () => {
    const findUnique = jest.fn().mockResolvedValue(null);
    const prisma = {
      profile: { findUnique },
    } as unknown as PrismaService;
    const service = new ProfileService(prisma);

    await expect(service.findProfile()).resolves.toBeNull();
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: "denis-durnov" },
      include: {
        links: true,
        skills: true,
        experience: true,
        projects: true,
      },
    });
  });

  it("decodes experience achievements into GraphQL string arrays", async () => {
    const profile = {
      id: "denis-durnov",
      name: "Denis Durnov",
      description: "Admin",
      links: [],
      skills: [],
      experience: [
        {
          id: "experience-1",
          company: "Example",
          position: "Developer",
          period: "2025",
          achievements: JSON.stringify(["Built a portfolio"]),
          profileId: "denis-durnov",
        },
      ],
      projects: [],
    };
    const prisma = {
      profile: { findUnique: jest.fn().mockResolvedValue(profile) },
    } as unknown as PrismaService;
    const service = new ProfileService(prisma);

    await expect(service.findProfile()).resolves.toMatchObject({
      experience: [{ achievements: ["Built a portfolio"] }],
    });
  });

  it("reports invalid stored achievements", async () => {
    const profile = {
      id: "denis-durnov",
      name: "Denis Durnov",
      description: "Admin",
      links: [],
      skills: [],
      experience: [
        {
          id: "experience-1",
          company: "Example",
          position: "Developer",
          period: "2025",
          achievements: "not-json",
          profileId: "denis-durnov",
        },
      ],
      projects: [],
    };
    const prisma = {
      profile: { findUnique: jest.fn().mockResolvedValue(profile) },
    } as unknown as PrismaService;
    const service = new ProfileService(prisma);

    await expect(service.findProfile()).rejects.toThrow(
      "Stored experience achievements are not valid JSON",
    );
  });
});
