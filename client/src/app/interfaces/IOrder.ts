export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  pictureUrl: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
}

export interface IOrder {
  id: number;
  buyerId: string;
  shippingAddress: ShippingAddress;
  orderDate: string;
  orderItems: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  orderStatus: string;
  deliveryStatus: string;
  total: number;
  isRefund: boolean;
  isUserNotifi: boolean;
  isVnPay: boolean;
  orderId: string;
  paymentIntentId: string;
  discount: number;
}

export interface OrdersParams {
  searchTerm?: string;
}
