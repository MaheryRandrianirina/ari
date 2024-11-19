
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required: true, minlength: 3})
  username: string;

  @Prop({required: true, minlength: 8})
  password: string;

  @Prop({required: true})
  refresh_token: string;

  @Prop({default: ""})
  role: "user"|"admin"|""

}

export const UserSchema = SchemaFactory.createForClass(User);
