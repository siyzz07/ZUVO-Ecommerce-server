import Category, { ICategory } from '../../core/entities/Category';
import { ICategoryRepository } from '../../core/repositories/ICategoryRepository';

export class MongooseCategoryRepository implements ICategoryRepository {
  async findAll(): Promise<ICategory[]> {
    return await Category.find().sort({ name: 1 });
  }

  async findById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async create(categoryData: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(categoryData);
    return await category.save();
  }

  async update(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, categoryData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Category.findByIdAndDelete(id);
    return result !== null;
  }
}
