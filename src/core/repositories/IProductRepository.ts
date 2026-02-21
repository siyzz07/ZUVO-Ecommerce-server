import { IProduct } from '../entities/Product';

export interface IProductRepository {
  findAll(): Promise<IProduct[]>;
  findById(id: string): Promise<IProduct | null>;
  create(product: Partial<IProduct>): Promise<IProduct>;
  update(id: string, product: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string): Promise<boolean>;
}
