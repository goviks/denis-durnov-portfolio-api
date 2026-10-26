import { NotFoundException } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { ProfileModel } from "./models/profile.model";
import { ProfileService } from "./profile.service";

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel)
  async profile(): Promise<ProfileModel> {
    const profile = await this.profileService.findProfile();
    if (!profile) {
      throw new NotFoundException("Profile data has not been initialized");
    }
    return profile;
  }
}
