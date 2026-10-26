import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("ProfileLink")
export class ProfileLinkModel {
  @Field()
  label!: string;

  @Field()
  url!: string;
}
