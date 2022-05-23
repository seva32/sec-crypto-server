import mongoose, { Document } from 'mongoose';

export interface Address extends Document {
  readonly title: string;
  readonly address: string;
  readonly user: mongoose.Schema.Types.ObjectId;
  readonly created_at: Date;
}
