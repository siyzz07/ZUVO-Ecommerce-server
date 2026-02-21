import { IShopRepository } from '../../core/repositories/IShopRepository';
import { IShopSettings } from '../../core/entities/ShopSettings';

export class ShopService {
  constructor(private shopRepository: IShopRepository) {}

  async getShopSettings() {
    let settings = await this.shopRepository.getSettings();
    if (!settings) {
      // Return default empty settings if none exist
      return {
        shopName: 'OZACO Mobile Hub',
        description: 'Premium Gadget Store',
        address: '',
        phone: '',
        email: '',
        coverPhotos: [],
        location: { lat: 28.6139, lng: 77.2090 }
      };
    }
    return settings;
  }

  async updateShopSettings(data: Partial<IShopSettings>) {
    return await this.shopRepository.updateSettings(data);
  }
}
