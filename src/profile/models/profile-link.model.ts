import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("ProfileLink")
export class ProfileLinkModel {
  @Field()
  id!: string;

  @Field()
  label!: string;

  @Field()
  url!: string;
}
