import { Document } from 'mongoose';

export interface Address extends Document {
  readonly title: string;
  readonly address: string;
  readonly fave: boolean;
  readonly eur: string;
  readonly usd: string;
  readonly created_at: Date;
}
