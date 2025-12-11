import { Component,  } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'admin-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  
}
