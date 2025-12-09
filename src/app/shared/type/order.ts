export type Order = {
  id: string;
  user: string;
  products: string[];
  totalPrice: number;
  orderDate: string;
  status: string;
}