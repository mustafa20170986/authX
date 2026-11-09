import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;
  @Prop({ required: true })
  password!: string;
  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role!: string;
  @Prop({})
  hashed_refresh_token?: string;
}
export const UserModel = SchemaFactory.createForClass(User);
