import * as mongoose from 'mongoose';

export const UserModel = new mongoose.Schema({
  fullname: String,
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true,
    lowercase: true,
  },
  password: String,
  addresses: { type: Array, default: [] },
  created_at: { type: Date, default: Date.now },
});
