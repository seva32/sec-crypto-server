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
  fave: Boolean,
  eur: String,
  usd: String,
  created_at: { type: Date, default: Date.now, immutable: true },
});
