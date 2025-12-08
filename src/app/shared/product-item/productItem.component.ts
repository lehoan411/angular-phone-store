import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CurrencyPipe } from '../pipes/CurencyPipe.pipe';
import { UpperCasePipe } from '../pipes/UpperCasePipe.pipe';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductItem } from '../type/productItem';


@Component({
  selector: 'product-item-root',
  standalone: true,
  imports: [
    FormsModule, CurrencyPipe, UpperCasePipe,
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

  currentPage = 1;
  pageSize = 8;
  totalPages = 1;

  sortOption: string = '';
  searchText: string = ''; 
  filteredProducts: ProductItem[] = [];

  ngOnChanges() {
    this.filteredProducts = [...this.products];
    this.applyFilters();
  }


  applyFilters() {
    let result = [...this.products];

    const text = this.searchText.trim().toLowerCase();

    if (text !== '') {
      const searchNumber = Number(text);

      result = result.filter(p => {
        const matchName = p.name.toLowerCase().includes(text);
        const matchPrice = !isNaN(searchNumber) && p.price === searchNumber;
        return matchName || matchPrice;
      });
    }


    switch (this.sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    this.filteredProducts = result;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
