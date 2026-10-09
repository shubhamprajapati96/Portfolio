import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminUserDocument = AdminUser & Document;

@Schema({ timestamps: true })
export class AdminUser {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true, default: 'Administrator' })
  name!: string;

  @Prop({ default: 'admin' })
  role!: string;

  @Prop({ default: Date.now })
  lastLoginAt!: Date;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
