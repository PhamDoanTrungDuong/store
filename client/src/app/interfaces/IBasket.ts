export interface BasketItem {
  productId: number;
  name: string;
  price: number;
  pictureUrl: string;
  brand: string;
  type: string;
  quantity: number;
}

export interface IBasket {
  id: number;
  buyerId: string;
  items: BasketItem[];
}
