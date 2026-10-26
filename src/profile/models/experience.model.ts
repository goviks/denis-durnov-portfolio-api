import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("Experience")
export class ExperienceModel {
  @Field()
  id!: string;

  @Field()
  company!: string;

  @Field()
  position!: string;

  @Field()
  period!: string;

  @Field(() => [String])
  achievements!: string[];
}
