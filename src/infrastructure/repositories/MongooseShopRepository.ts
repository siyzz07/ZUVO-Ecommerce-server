import ShopSettings, { IShopSettings } from '../../core/entities/ShopSettings';
import { IShopRepository } from '../../core/repositories/IShopRepository';

export class MongooseShopRepository implements IShopRepository {
  async getSettings(): Promise<IShopSettings | null> {
    return await ShopSettings.findOne();
  }

  async updateSettings(settingsData: Partial<IShopSettings>): Promise<IShopSettings> {
    let settings = await ShopSettings.findOne();
    if (settings) {
      Object.assign(settings, settingsData);
      settings.updatedAt = new Date();
      return await settings.save();
    } else {
      settings = new ShopSettings(settingsData);
      return await settings.save();
    }
  }
}
