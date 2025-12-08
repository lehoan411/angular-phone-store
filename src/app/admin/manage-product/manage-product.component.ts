import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/ProductService';
import { UserService } from '../../../services/UserService';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductItem } from '../../shared/type/productItem';
import { Router } from '@angular/router';
import { CurrencyPipe } from '../../shared/pipes/CurencyPipe.pipe';
import { UpperCasePipe } from '../../shared/pipes/UpperCasePipe.pipe';
import { LocalStorageService } from '../../shared/storage/local-storage.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'manage-product-root',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, UpperCasePipe, FormsModule,],
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css',]
})
export class ManageProductComponent implements OnInit {

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

  isOpen = false;
  editId: string | null = null;
  editData = {
    name: '',
    price: '',
    image: ''
  };

  startInlineEdit(item: ProductItem) {
    this.editId = item.id;
    this.editData = {
      name: item.name,
      price: String(item.price),
      image: item.image
    };
  }

  cancelInlineEdit() {
    this.editId = null;
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
    this.product.reset();
  }
  constructor(private localStorageService: LocalStorageService, private userService: UserService, private productService: ProductService, private router: Router) {
  }

  handleAddCart() {
    if (this.name?.hasError('required') || this.price?.hasError('required') || this.image?.hasError('required')) return;
    const userData = this.localStorageService.getItem('token');
    console.log(userData);
    if (!userData) {
      alert('Please log in to create a product.');
      return;
    }
    const productItem: ProductItem = {
      id: Math.random().toString(),
      user: JSON.parse(atob(userData)).id,
      name: String(this.name?.value),
      price: Number(this.price?.value),
      image: String(this.image?.value)
    }
    if(productItem.price <= 0 || isNaN(productItem.price)) {
      alert('Price must be a positive number.');
      return;
    }
    this.productService.postProduct(productItem).subscribe((res: any) => {
      if (res.id) {
        this.closeModal()
        alert('Product created successfully!');
        window.location.reload();
      }
    });
  }

  productList: ProductItem[] = [];


  ngOnInit(): void {
    const currentUser = this.localStorageService.getItem('token');
    let user: any = {};
    if (currentUser) {
      user = JSON.parse(atob(currentUser));
    }

    this.productService.getProducts().subscribe((res: any) => {
      this.productList = res.filter((product: ProductItem) => product.user == user.id);
    });
  }


  handleEdit(id: string) {
    const userData = this.localStorageService.getItem('token');
    console.log(userData);
    if (!userData) {
      alert('Please log in to create a product.');
      return;
    }

    const updatedProduct: ProductItem = {
      id: id.toString(),
      user: JSON.parse(atob(userData)).id,
      name: this.editData.name,
      price: Number(this.editData.price),
      image: this.editData.image
    };

    this.productService.editProduct(updatedProduct).subscribe((res: any) => {
      if (res.id) {


        const index = this.productList.findIndex(p => p.id === id.toString());
        if (index !== -1) this.productList[index] = res;

        this.editId = null;
      }
    });
  }

  handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this product?') == true) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.productList = this.productList.filter(item => item.id !== id);
        alert('Product deleted successfully!');
        window.location.reload();
      });
    } else {
      return;
    }
  }
}