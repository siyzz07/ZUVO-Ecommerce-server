import { Request, Response } from 'express';
import { ProductService } from '../../application/services/ProductService';
import { MongooseProductRepository } from '../../infrastructure/repositories/MongooseProductRepository';
import logger from '../../config/logger';

const productRepository = new MongooseProductRepository();
const productService = new ProductService(productRepository);

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error: any) {
    logger.error(`Failed to fetch products: ${error.message}`);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.addProduct(req.body);
    logger.info(`New product added: ${product.name}`);
    res.status(201).json(product);
  } catch (error: any) {
    logger.error(`Failed to add product: ${error.message}`);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await productService.getProductById(id as string);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    logger.error(`Failed to fetch product ID ${id}: ${error.message}`);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await productService.updateProduct(id as string, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    logger.info(`Product updated: ${product.name}`);
    res.json(product);
  } catch (error: any) {
    logger.error(`Failed to update product ID ${id}: ${error.message}`);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await productService.removeProduct(id as string);
    if (deleted) {
      logger.info(`Product deleted: ID ${id}`);
      res.json({ message: 'Product deleted' }); 
    } else {
      logger.warn(`Attempted to delete non-existent product: ID ${id}`);
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    logger.error(`Failed to delete product ID ${id}: ${error.message}`);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
