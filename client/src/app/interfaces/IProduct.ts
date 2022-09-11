export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  type?: string;
  brand: string;
  quantityInStock?: number;
  color: string;
  size: string;
}

export interface ProductParams {
  orderBy: string;
  searchTerm?: string;
  types: string[];
  brands: string[];
  pageNumber: number;
  pageSize: number;
}

export interface CategoriesParams {
  searchTerm?: string;
}

export interface CommentsParams {
  searchTerm?: string;
}
