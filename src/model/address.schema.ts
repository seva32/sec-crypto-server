import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type AddressDocument = Address & Document;

@Schema()
export class Address {
  @Prop()
  title: string;
  @Prop()
  address: string;
  @Prop()
  coverImage: string;
  @Prop({ default: Date.now() })
  uploadDate: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}
export const AddressSchema = SchemaFactory.createForClass(Address);
