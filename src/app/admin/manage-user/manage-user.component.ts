import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/ProductService';
import { UserService } from '../../../services/UserService';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../shared/type/user';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/storage/local-storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'manage-user-root',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css',]
})
export class ManageUserComponent implements OnInit {
  userList: User[] = []

  constructor(private localStorageService: LocalStorageService, private userService: UserService, private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    const currentUser = this.localStorageService.getItem('token');
    let user: any = {};
    if (currentUser) {
      user = JSON.parse(atob(currentUser));
    }

    this.userService.getUsers().subscribe((res: any) => {
      this.userList = res.filter((u: User) => u.id !== user.id);
    });
  }

  handleBanUser(id: string) {
    const userToBan = this.userList.find(u => u.id === id);
    if (!userToBan) return;
    userToBan.status = userToBan.status === 'active' ? 'banned' : 'active';
    this.userService.editUser(userToBan).subscribe((res: any) => {
      if (res.status === 'active') {
        this.userList = this.userList.map(u => u.id === id ? res : u);
        alert('User has been banned successfully');
      } else {
        this.userList = this.userList.map(u => u.id === id ? res : u);
        alert('User has been unbanned successfully');
      }
    });
  }



}