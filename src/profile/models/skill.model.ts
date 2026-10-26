import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("Skill")
export class SkillModel {
  @Field()
  id!: string;

  @Field()
  name!: string;
}
