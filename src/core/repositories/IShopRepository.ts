import { IShopSettings } from '../entities/ShopSettings';

export interface IShopRepository {
  getSettings(): Promise<IShopSettings | null>;
  updateSettings(settings: Partial<IShopSettings>): Promise<IShopSettings>;
}
