export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  type?: string;
  brand: string;
  viewCount?: number;
  quantityInStock?: number;
  color: string;
  size: string;
}

export interface IProductDiscount {
  id: number;
  productId: number;
  productName: string;
  price: number;
  pictureUrl: string;
  type?: string;
  brand: string;
  quantityInStock: number;
  dateCreate: string;
  discountValue: number;
}

export interface ProductParams {
  orderBy: string;
  searchTerm?: string;
  types: string[];
  brands: string[];
  pageNumber: number;
  pageSize: number;
  minPrice: string;
  maxPrice: string;
}

export interface CategoriesParams {
  searchTerm?: string;
}

export interface CommentsParams {
  searchTerm?: string;
}
