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
  password: {
    type: String,
    required: true,
  },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  created_at: { type: Date, default: Date.now },
});
