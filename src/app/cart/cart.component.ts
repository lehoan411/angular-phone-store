import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { ProductService } from '../../services/ProductService';
import { CartService } from '../../services/CartService';
import { UserService } from '../../services/UserService';
import { CurrencyPipe } from '../shared/pipes/CurencyPipe.pipe';
import { UpperCasePipe } from '../shared/pipes/UpperCasePipe.pipe';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../shared/storage/local-storage.service';
import { OrderService } from '../../services/OrderService';
import { Order } from '../shared/type/order';

@Component({
  selector: 'cart-root',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, UpperCasePipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  subscription = new Subscription();

  cartItems: any[] = [];

  orderItems: any[] = [];

  get totalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.price, 0);
  }

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.subscription = combineLatest([
      this.userService.getUsers(),
      this.productService.getProducts(),
      this.cartService.getCarts()
    ]).subscribe(([users, products, carts]) => {
      const userData = this.localStorageService.getItem('token');
      let currentUserId = null;
      if (userData) {
        const user = JSON.parse(atob(userData));
        currentUserId = user.id;
      }
      this.cartItems = carts.filter(cart => cart.user === currentUserId).map(cart => {
        const user = users.find(u => u.id.toString() === cart.user);
        const product = products.find(p => p.id === cart.product);

        return {
          id: cart.id,
          user: user || {},
          product: product || {}
        };
      });

    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleDelete(id: string) {
    this.cartService.deleteCart(id).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.id !== id);
    });
    window.location.reload();
  }

  handleCheckout() {
    if (this.cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const userId = this.cartItems[0].user.id;

   
    this.orderService.getOrders().subscribe(orders => {
      const hasPendingOrder = orders.some(
        o => o.user === userId && o.status.toLowerCase() === "Pending"
      );

      if (hasPendingOrder) {
        alert("You already have a pending order! Please complete it before creating a new one.");
        return;
      }

 
      const order: Order = {
        id: Math.random().toString(36).substring(2),
        user: userId,
        products: this.cartItems.map(item => item.product.id),
        totalPrice: this.totalPrice,
        orderDate: new Date().toISOString(),
        status: 'Pending'
      };

      this.orderService.addOrder(order).subscribe({
        next: () => {
          const deleteRequests = this.cartItems.map(item =>
            this.cartService.deleteCart(item.id)
          );

          combineLatest(deleteRequests).subscribe(() => {
            alert("Checkout successful!");
            this.cartItems = [];
            window.location.href = '/orders';
          });
        },
        error: () => alert("Checkout failed!")
      });
    });
  }
}
