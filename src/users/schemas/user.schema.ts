import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/enum/role.enum';
import { Status } from 'src/common/enum/status.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fName: string;

  @Prop({ required: true })
  lName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Role.USER, enum: Role, type: String })
  role: Role;

  @Prop({ default: null })
  profile: string;

  @Prop({ default: Status.ACTIVE, enum: Status })
  status: Status;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: null })
  lastLoginAt: Date;

  @Prop({ default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ deletedAt: 1 }); // Makes soft-delete queries fast
