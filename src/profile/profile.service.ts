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

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  findProfile(): Promise<ProfileWithRelations | null> {
    return this.prisma.profile.findUnique({
      where: { id: "denis-durnov" },
      ...profileWithRelations,
    });
  }
}
