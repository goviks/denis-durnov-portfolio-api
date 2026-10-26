import { Field, ObjectType } from "@nestjs/graphql";
import { ExperienceModel } from "./experience.model";
import { ProjectModel } from "./project.model";
import { ProfileLinkModel } from "./profile-link.model";
import { SkillModel } from "./skill.model";

@ObjectType("Profile")
export class ProfileModel {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => [ProfileLinkModel])
  links!: ProfileLinkModel[];

  @Field(() => [SkillModel])
  skills!: SkillModel[];

  @Field(() => [ExperienceModel])
  experience!: ExperienceModel[];

  @Field(() => [ProjectModel])
  projects!: ProjectModel[];
}
