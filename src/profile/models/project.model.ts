import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("Project")
export class ProjectModel {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  url!: string;
}
