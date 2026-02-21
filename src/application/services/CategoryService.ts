import { ICategoryRepository } from '../../core/repositories/ICategoryRepository';
import { ICategory } from '../../core/entities/Category';

export class CategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async getAllCategories() {
    return await this.categoryRepository.findAll();
  }

  async getCategoryById(id: string) {
    return await this.categoryRepository.findById(id);
  }

  async addCategory(categoryData: Partial<ICategory>) {
    if (categoryData.name && !categoryData.slug) {
        categoryData.slug = categoryData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return await this.categoryRepository.create(categoryData);
  }

  async updateCategory(id: string, categoryData: Partial<ICategory>) {
    if (categoryData.name && !categoryData.slug) {
        categoryData.slug = categoryData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return await this.categoryRepository.update(id, categoryData);
  }

  async removeCategory(id: string) {
    return await this.categoryRepository.delete(id);
  }
}
