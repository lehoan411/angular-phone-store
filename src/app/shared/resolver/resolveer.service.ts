import { inject } from '@angular/core';
import { ProductService } from '../../../services/ProductService';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { ProductItem } from '../type/productItem';

export const productResolver: ResolveFn<ProductItem[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const productService = inject(ProductService);
  return productService.getProducts();
};
