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
});
