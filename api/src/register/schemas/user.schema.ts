
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required: true, minlength: 3})
  username: string;

  @Prop({required: true, minlength: 8})
  password: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
