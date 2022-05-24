import mongoose from 'mongoose';

export class CreateUserDTO {
  readonly fullname: string;
  readonly email: string;
  readonly password: string;
  readonly addresses: mongoose.Schema.Types.ObjectId[];
  readonly created_at: Date;
}
