import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Detail } from './detail/detail';
import { ManageProductComponent } from './admin/manage-product/manage-product.component';
import { ManageUserComponent } from './admin/manage-user/manage-user.component';
import { RegisterComponent } from './authentication/register.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './authentication/login.component';
import { AdminComponent } from './admin/admin.component';
import { DonationComponent } from './donation/donation.component';

export const routes: Routes = [
  {
    path: '', component: Home, title: 'Home', 
  },
  {
    path: 'detail/:id', loadComponent: () => Detail, title: 'Detail'
  },
  {
    path: 'login', component: LoginComponent, title: 'Login',  
  },
  {
    path: 'register', component: RegisterComponent, title: 'Register'
  },

  {
    path: 'cart', component: CartComponent, title: 'Cart', 
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'manage-user', component: ManageUserComponent },
      { path: 'manage-product', component: ManageProductComponent },
      { path: '', redirectTo: 'manage-product', pathMatch: 'full' }
    ],
    
    title: 'Admin'
  },
  {
    path: 'donation', component: DonationComponent, title: 'Donation'
  }
];
