import { Document } from 'mongoose';

export interface User extends Document {
  readonly fullname: string;
  readonly email: string;
  readonly password: string;
  readonly addresses?: string;
  readonly created_at: Date;
}
