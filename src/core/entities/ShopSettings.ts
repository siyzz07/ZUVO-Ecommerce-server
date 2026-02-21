import mongoose, { Schema, Document } from 'mongoose';

export interface IShopSettings extends Document {
  shopName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  coverPhotos: string[]; // Up to 4
  location: {
    lat: number;
    lng: number;
  };
  updatedAt: Date;
}

const ShopSettingsSchema: Schema = new Schema({
  shopName: { type: String, required: true },
  description: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  coverPhotos: { type: [String], validate: [(val: string[]) => val.length <= 4, '{PATH} exceeds the limit of 4'] },
  location: {
    lat: { type: Number, default: 28.6139 }, // Default New Delhi
    lng: { type: Number, default: 77.2090 }
  },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IShopSettings>('ShopSettings', ShopSettingsSchema);
