import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ required: true })
  expiresAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
