import { NotFoundException } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileResolver } from "./profile.resolver";

describe("ProfileResolver", () => {
  it("returns the profile from the service", async () => {
    const profile = {
      id: "denis-durnov",
      name: "Denis Durnov",
      description: "Admin",
      links: [],
      skills: [],
      experience: [],
      projects: [],
    };
    const service = {
      findProfile: jest.fn().mockResolvedValue(profile),
    } as unknown as ProfileService;
    const resolver = new ProfileResolver(service);

    await expect(resolver.profile()).resolves.toBe(profile);
  });

  it("throws when the profile has not been initialized", async () => {
    const service = {
      findProfile: jest.fn().mockResolvedValue(null),
    } as unknown as ProfileService;
    const resolver = new ProfileResolver(service);

    await expect(resolver.profile()).rejects.toThrow(NotFoundException);
  });
});
