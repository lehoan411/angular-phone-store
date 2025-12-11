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
import { OrderComponent } from './order/order.component';

import { AuthGuard } from './shared/auth-guard/auth-guard';
import { AdminGuard } from './shared/auth-guard/admin.guard';
import { UserGuard } from './shared/auth-guard/user.guard';

export const routes: Routes = [
  {
    path: '', component: Home, title: 'Home', canActivate: [UserGuard],
  },
  {
    path: 'detail/:id', loadComponent: () => Detail, title: 'Detail', canActivate: [UserGuard],
  },
  {
    path: 'login', component: LoginComponent, title: 'Login',
  },
  {
    path: 'register', component: RegisterComponent, title: 'Register'
  },
  {
    path: 'profile-setting', loadComponent: () => import('./profile-setting/profile-setting.component').then(m => m.ProfileSettingComponent), title: 'Profile Setting', canActivate: [AuthGuard],
  },

  {
    path: 'cart', component: CartComponent, title: 'Cart', canActivate: [AuthGuard, UserGuard],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () =>
      import('./admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: 'manage-user',
        loadComponent: () =>
          import('./admin/manage-user/manage-user.component').then(m => m.ManageUserComponent),
          canActivate: [AdminGuard],
      },
      {
        path: 'manage-product',
        loadComponent: () =>
          import('./admin/manage-product/manage-product.component').then(m => m.ManageProductComponent),
          canActivate: [AdminGuard],
      },
      {
        path: '',
        redirectTo: 'manage-user',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'donation', component: DonationComponent, title: 'Donation'
  },
  {
    path: 'orders', component: OrderComponent, title: 'Orders', canActivate: [AuthGuard, UserGuard]
  }
];
