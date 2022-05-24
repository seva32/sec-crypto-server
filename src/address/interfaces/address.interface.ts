import { Document } from 'mongoose';

export interface Address extends Document {
  readonly title: string;
  readonly address: string;
  readonly created_at: Date;
}
