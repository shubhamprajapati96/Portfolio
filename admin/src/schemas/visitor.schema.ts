import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VisitorDocument = Visitor & Document;

@Schema({ timestamps: true })
export class Visitor {
  @Prop({ default: '127.0.0.1', index: true })
  ipAddress!: string;

  @Prop({ default: 'Unknown Country', index: true })
  country!: string;

  @Prop({ default: 'Unknown City' })
  city!: string;

  @Prop({ default: 'Unknown Region' })
  region!: string;

  @Prop({ default: 'UTC' })
  timezone!: string;

  @Prop({ default: 'Unknown' })
  userAgent!: string;

  @Prop({ default: 'Unknown Browser' })
  browser!: string;

  @Prop({ default: 'Unknown OS' })
  os!: string;

  @Prop({ default: 'desktop', enum: ['desktop', 'mobile', 'tablet', 'unknown'] })
  deviceType!: string;

  @Prop({ default: '/' })
  pageUrl!: string;

  @Prop({ default: 'Direct' })
  referrer!: string;

  // Source: 'web' or 'apk'
  @Prop({ default: 'web', enum: ['web', 'apk'], index: true })
  source!: string;

  @Prop({ default: 1 })
  visitCount!: number;

  @Prop({ default: Date.now })
  firstVisitedAt!: Date;

  @Prop({ default: Date.now, index: true })
  lastVisitedAt!: Date;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
VisitorSchema.index({ lastVisitedAt: -1 });
VisitorSchema.index({ country: 1 });
VisitorSchema.index({ source: 1 });
