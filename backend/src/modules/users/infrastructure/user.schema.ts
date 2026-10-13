import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class UserMongo {
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, trim: true })
  displayName!: string;

  @Prop({ required: true, index: true })
  tenantId!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export type UserMongoDocument = HydratedDocument<UserMongo>;
export const UserSchema = SchemaFactory.createForClass(UserMongo);
