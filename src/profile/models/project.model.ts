import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("Project")
export class ProjectModel {
  @Field()
  name!: string;

  @Field()
  url!: string;
}
