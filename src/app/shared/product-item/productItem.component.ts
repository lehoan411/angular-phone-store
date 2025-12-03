import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {CurrencyPipe} from '../pipes/CurencyPipe.pipe';
import {UpperCasePipe} from '../pipes/UpperCasePipe.pipe';
import {FormsModule} from '@angular/forms';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ProductItem} from '../type/productItem';


@Component({
  selector: 'product-item-root',
  standalone: true,
  imports: [
    FormsModule, CurrencyPipe, UpperCasePipe, RouterLink, RouterOutlet
  ],
  templateUrl: './productItem.component.html',
  styleUrl: './productItem.component.css'
})
export class ProductItemComponent {
  @Input() products: ProductItem[] = []
  @Input() cartItems: any[] = []
  @Output() onAddToCart: EventEmitter<ProductItem> = new EventEmitter<ProductItem>();
  handleAddToCart = (product: ProductItem) => {
    this.onAddToCart.emit(product);
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log(changes['products'].currentValue);
  //   console.log(changes['products'].previousValue);
  // }

  // ngOnDestroy(): void {
  //   console.log('Component Destroyed');
  // }
}
