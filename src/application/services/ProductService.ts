import { IProductRepository } from '../../core/repositories/IProductRepository';
import { IProduct } from '../../core/entities/Product';

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  async getAllProducts() {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string) {
    return await this.productRepository.findById(id);
  }

  async addProduct(productData: Partial<IProduct>) {
    return await this.productRepository.create(productData);
  }

  async updateProduct(id: string, productData: Partial<IProduct>) {
    return await this.productRepository.update(id, productData);
  }

  async removeProduct(id: string) {
    return await this.productRepository.delete(id);
  }
}
