import mongoose, { Document } from 'mongoose';

export interface User extends Document {
  readonly fullname: string;
  readonly email: string;
  readonly password: string;
  readonly addresses?: mongoose.Schema.Types.ObjectId[];
  readonly created_at: Date;
}
