
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type taskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({required: true})
  name: string;

  @Prop({default: "not done"})
  status: "done"|"in progress"|"not done";

  @Prop({ref: "users", type: Types.ObjectId, default:null})
  user_id: Types.ObjectId|null
}

export const TaskSchema = SchemaFactory.createForClass(Task);
