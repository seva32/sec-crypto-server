import * as mongoose from 'mongoose';

export const AddressModel = new mongoose.Schema({
  title: { type: String, required: true },
  address: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    immutable: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
  },
  created_at: { type: Date, default: Date.now, immutable: true },
});
