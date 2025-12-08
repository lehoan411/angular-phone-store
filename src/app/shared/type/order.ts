export type Order = {
  id: string;
  user: string;
  product: [string];
  totalPrice: number;
  orderDate: string;
  status: string;
}