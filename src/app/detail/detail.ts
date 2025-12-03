import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import { ProductItem } from '../shared/type/productItem';
import { ProductService } from '../../services/ProductService';
import { CartService } from '../../services/CartService';
import { CurrencyPipe } from '../shared/pipes/CurencyPipe.pipe';
import { UpperCasePipe } from '../shared/pipes/UpperCasePipe.pipe';



@Component({
  selector: 'detail-root',
  standalone: true,
  imports: [RouterOutlet, UpperCasePipe, CurrencyPipe],
templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit{
  id = '';
  productItem: ProductItem = {
    id: 0,
    image: '',
    name: '',
    price: 0,
  }
  constructor(private route: ActivatedRoute, private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.getRoute(this.route.snapshot.params['id']);
  }

  getRoute(id:any){
    this.productService.detailProduct(id).subscribe((res:any) => {
      this.productItem = res;
      console.log(res);
    });   
  }

  handleAddToCart(){
    const cartItem = {
      id: Math.random(),
      user: 1,
      product: this.productItem.id
    }
    this.cartService.addToCart(cartItem).subscribe((res: any) => {
      if (res.id) {
        alert('Product added to cart successfully!');
      }
    });
  }
}
