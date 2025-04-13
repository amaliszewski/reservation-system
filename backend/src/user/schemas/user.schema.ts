import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, type: String })
  username: string;

  @Prop({ required: true, minlength: 8, type: String })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
