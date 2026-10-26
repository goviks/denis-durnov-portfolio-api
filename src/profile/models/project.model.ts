import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("Project")
export class ProjectModel {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field()
  url!: string;

  @Field(() => String, { nullable: true })
  demoUrl?: string | null;
}
