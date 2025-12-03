import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Detail } from './detail/detail';
import { CreateComponent } from './create/create.component';
import { RegisterComponent } from './authentication/register.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './authentication/login.component';

export const routes: Routes = [
  {
    path: '', component: Home
  },
  {
    path: 'detail/:id', component: Detail
  },
  {
    path: 'login', component: LoginComponent 
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create/create.component').then((m) => m.CreateComponent)
  },
  {
    path: 'cart', component: CartComponent
  }
];
