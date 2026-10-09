import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnquiryDocument = Enquiry & Document;

@Schema({ timestamps: true })
export class Enquiry {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, trim: true })
  subject!: string;

  @Prop({ required: true, trim: true })
  message!: string;

  // Geolocation & Device Tracking Details
  @Prop({ default: '127.0.0.1' })
  ipAddress!: string;

  @Prop({ default: 'Unknown Country' })
  country!: string;

  @Prop({ default: 'Unknown City' })
  city!: string;

  @Prop({ default: 'Unknown Region' })
  region!: string;

  @Prop({ default: 'Unknown' })
  userAgent!: string;

  @Prop({ default: 'desktop' })
  deviceType!: string;

  @Prop({ default: 'Web' })
  platform!: string;

  // Origin: 'web' or 'apk'
  @Prop({ default: 'web', enum: ['web', 'apk'] })
  source!: string;

  // Status: 'new', 'read', 'replied', 'archived'
  @Prop({ default: 'new', enum: ['new', 'read', 'replied', 'archived'] })
  status!: string;

  @Prop({ default: '' })
  notes!: string;
}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry);
EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ email: 1 });
EnquirySchema.index({ status: 1 });
