import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DownloadDocument = Download & Document;

@Schema({ timestamps: true })
export class Download {
  @Prop({ default: '127.0.0.1', index: true })
  ipAddress!: string;

  @Prop({ default: 'Unknown Country', index: true })
  country!: string;

  @Prop({ default: 'Unknown City' })
  city!: string;

  @Prop({ default: 'Unknown Region' })
  region!: string;

  @Prop({ default: 'Unknown' })
  userAgent!: string;

  @Prop({ default: 'desktop' })
  deviceType!: string;

  @Prop({ default: 'Android' })
  platform!: string;

  @Prop({ default: 'Direct' })
  referrer!: string;

  @Prop({ default: '1.0.0' })
  version!: string;

  // Source where download was initiated, e.g. 'web_hero', 'web_apk_card', 'direct_url'
  @Prop({ default: 'web_button' })
  source!: string;

  @Prop({ default: Date.now, index: true })
  timestamp!: Date;
}

export const DownloadSchema = SchemaFactory.createForClass(Download);
DownloadSchema.index({ timestamp: -1 });
DownloadSchema.index({ country: 1 });
