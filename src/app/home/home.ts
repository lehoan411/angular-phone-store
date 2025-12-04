import { Component, DoCheck, OnDestroy, OnInit, signal, } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductItem } from '../shared/type/productItem';
import { ProductItemComponent } from '../shared/product-item/productItem.component';
import { ProductService } from '../../services/ProductService';
import { CartService } from '../../services/CartService';
import { map, Subscription } from 'rxjs';



@Component({
  selector: 'home-root',
  standalone: true,
  imports: [RouterOutlet, ProductItemComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})


export class Home implements OnInit, OnDestroy {

  isVisible = true

  getProductApi: Subscription


  products: ProductItem[] = []

  constructor(private productService: ProductService, private cartService: CartService) {
    this.getProductApi = new Subscription()
  }

  ngOnInit(): void {
    this.getProductApi = this.productService.getProducts().pipe(
      map((data) =>
        data.map((item: any) => {
          return {
            ...item,
            price: Number(item.price),
          }
        })
      )
    ).subscribe((res) => {
      this.products = res;
      //  console.log('Fetched blog data', res);
    })
  }

  ngOnDestroy(): void {
    if (this.getProductApi) {
      this.getProductApi.unsubscribe()
    }
  }

  handleAddToCart = (product: ProductItem) => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Please log in to add items to your cart.');
      return;
    }
    let currentUserId = null;
    if (userData) {
      const user = JSON.parse(userData);
      currentUserId = user.id;
    }
    const cartItem = {
      id: String(Math.random()),
      user: currentUserId,
      product: product.id
    }
    this.cartService.addToCart(cartItem).subscribe((res: any) => {
      if (res.id) {
        alert('Added to cart: ' + product.name);
      }
    })
  }

  // handleChangeVisible = () => {
  //   this.isVisible = false
  // }
}
