import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/ProductService';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogItem, ProductItem } from '../shared/type/productItem';
import { Router } from '@angular/router';




@Component({
  selector: 'create-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css', '../app.css']
})
export class CreateComponent {

  product = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
  })
  get name() {
    return this.product.get('name');
  }
  get price() {
    return this.product.get('price');
  }
  get image() {
    return this.product.get('image');
  }
  constructor(private productService: ProductService, private router: Router) {
  }

  handleAddCart() {
    if(this.name?.hasError('required') || this.price?.hasError('required') || this.image?.hasError('required')) return;
    const productItem: ProductItem = {
      id: Math.random(),
      name: String(this.name?.value),
      price: Number(this.price?.value),
      image: String(this.image?.value)
    }
    this.productService.postProduct(productItem).subscribe((res: any)=> {
      if (res.id) {
        this.router.navigate(['/']);
      }
    });
  }
}
