import { Request, Response } from 'express';
import logger from '../../config/logger';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = req.file.path;
    
    res.status(200).json({ 
      url: imageUrl,
      public_id: (req.file as any).filename 
    });
  } catch (error: any) {
    logger.error(`Upload error: ${error.message}`);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};
