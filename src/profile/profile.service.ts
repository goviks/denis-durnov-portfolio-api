import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const profileWithRelations = Prisma.validator<Prisma.ProfileDefaultArgs>()({
  include: {
    links: true,
    skills: true,
    experience: true,
    projects: true,
  },
});

type ProfileWithRelations = Prisma.ProfileGetPayload<
  typeof profileWithRelations
>;

type ProfileWithDecodedAchievements = Omit<
  ProfileWithRelations,
  "experience"
> & {
  experience: Array<
    Omit<ProfileWithRelations["experience"][number], "achievements"> & {
      achievements: string[];
    }
  >;
};

function decodeAchievements(value: string): string[] {
  let achievements: unknown;
  try {
    achievements = JSON.parse(value);
  } catch (error) {
    throw new Error("Stored experience achievements are not valid JSON", {
      cause: error,
    });
  }

  if (
    !Array.isArray(achievements) ||
    !achievements.every((achievement) => typeof achievement === "string")
  ) {
    throw new Error("Stored experience achievements must be a string array");
  }

  return achievements;
}

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findProfile(): Promise<ProfileWithDecodedAchievements | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: "denis-durnov" },
      ...profileWithRelations,
    });

    if (!profile) {
      return null;
    }

    return {
      ...profile,
      experience: profile.experience.map((item) => ({
        ...item,
        achievements: decodeAchievements(item.achievements),
      })),
    };
  }
}
