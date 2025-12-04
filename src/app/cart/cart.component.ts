import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { ProductService } from '../../services/ProductService';
import { CartService } from '../../services/CartService';
import { UserService } from '../../services/UserService';
import { CurrencyPipe } from '../shared/pipes/CurencyPipe.pipe';
import { UpperCasePipe } from '../shared/pipes/UpperCasePipe.pipe';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../shared/storage/local-storage.service';

@Component({
  selector: 'home-root',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, UpperCasePipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  subscription = new Subscription();

  cartItems: any[] = [];

  get totalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.price, 0);
  }

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.subscription = combineLatest([
      this.userService.getUsers(),
      this.productService.getProducts(),
      this.cartService.getCarts()
    ]).subscribe(([users, products, carts]) => {
      const userData = this.localStorageService.getItem('user');
      let currentUserId = null;
      if (userData) {
        const user = JSON.parse(userData);
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
}
