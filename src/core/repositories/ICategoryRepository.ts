import { ICategory } from '../entities/Category';

export interface ICategoryRepository {
  findAll(): Promise<ICategory[]>;
  findById(id: string): Promise<ICategory | null>;
  create(category: Partial<ICategory>): Promise<ICategory>;
  update(id: string, category: Partial<ICategory>): Promise<ICategory | null>;
  delete(id: string): Promise<boolean>;
}
