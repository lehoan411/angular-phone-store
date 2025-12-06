import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageProductComponent } from './manage-product/manage-product.component';

@Component({
  selector: 'admin-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  
}
