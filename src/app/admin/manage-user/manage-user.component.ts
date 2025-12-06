import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/ProductService';
import { UserService } from '../../../services/UserService';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../shared/type/user';
import { Router, RouterOutlet } from '@angular/router';
import { CurrencyPipe } from '../../shared/pipes/CurencyPipe.pipe';
import { UpperCasePipe } from '../../shared/pipes/UpperCasePipe.pipe';
import { LocalStorageService } from '../../shared/storage/local-storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'manage-user-root',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, UpperCasePipe, FormsModule, RouterOutlet, CommonModule],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css',]
})
export class ManageUserComponent implements OnInit {

  constructor(private localStorageService: LocalStorageService, private userService: UserService, private productService: ProductService, private router: Router) {
  }



  handleBanUser(id: string) {
    const userToBan = this.userList.find(u => u.id === id);
    if (!userToBan) return;
    userToBan.status = userToBan.status === 'active' ? 'banned' : 'active'; 
    this.userService.editUser(userToBan).subscribe((res: any) => {
        if(res.status === 'active') {
        this.userList = this.userList.map(u => u.id === id ? res : u);
        alert('User has been banned successfully');
        } else {
        this.userList = this.userList.map(u => u.id === id ? res : u);
        alert('User has been unbanned successfully');
        }
    });
  }

  userList: User[] = []

  ngOnInit(): void {
    const currentUser = this.localStorageService.getItem('user');
    let user: any = {};
    if (currentUser) {
      user = JSON.parse(currentUser);
    }

    this.userService.getUsers().subscribe((res: any) => {
        this.userList = res.filter((u: User) => u.id !== user.id);
    });
  }

}