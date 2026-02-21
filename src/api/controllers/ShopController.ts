import { Request, Response } from 'express';
import { ShopService } from '../../application/services/ShopService';
import { MongooseShopRepository } from '../../infrastructure/repositories/MongooseShopRepository';

const shopRepository = new MongooseShopRepository();
const shopService = new ShopService(shopRepository);

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await shopService.getShopSettings();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await shopService.updateShopSettings(req.body);
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
