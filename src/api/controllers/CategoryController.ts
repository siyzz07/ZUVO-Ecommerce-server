import { Request, Response } from 'express';
import { CategoryService } from '../../application/services/CategoryService';
import { MongooseCategoryRepository } from '../../infrastructure/repositories/MongooseCategoryRepository';
import logger from '../../config/logger';

const categoryRepository = new MongooseCategoryRepository();
const categoryService = new CategoryService(categoryRepository);

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error: any) {
    logger.error(`Failed to fetch categories: ${error.message}`);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await categoryService.getCategoryById(id as string);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error: any) {
    logger.error(`Failed to fetch category ID ${id}: ${error.message}`);
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.addCategory(req.body);
    logger.info(`New category added: ${category.name}`);
    res.status(201).json(category);
  } catch (error: any) {
    logger.error(`Failed to add category: ${error.message}`);
    res.status(500).json({ message: 'Error adding category', error: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await categoryService.updateCategory(id as string, req.body);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    logger.info(`Category updated: ${category.name}`);
    res.json(category);
  } catch (error: any) {
    logger.error(`Failed to update category ID ${id}: ${error.message}`);
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await categoryService.removeCategory(id as string);
    if (deleted) {
      logger.info(`Category deleted: ID ${id}`);
      res.json({ message: 'Category deleted' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error: any) {
    logger.error(`Failed to delete category ID ${id}: ${error.message}`);
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
