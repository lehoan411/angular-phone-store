import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../shared/type/user';
import { UserService } from '../../services/UserService';
import { LocalStorageService } from '../shared/storage/local-storage.service';







@Component({
  selector: 'login-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./authentication.component.css', '../app.css']
})
export class LoginComponent {

  login = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })
  get username() {
    return this.login.get('username');
  }
  get password() {
    return this.login.get('password');
  }
  constructor(private localStorageService: LocalStorageService, private userService: UserService, private router: Router) {
  }
   

  handleLogin() {
  if (this.login.invalid) return;

  const username = this.username?.value;
  const password = this.password?.value;

  this.userService.getUsers().subscribe((res: any) => {
    const matchedUser = res.find((u: User) =>
      u.username === username && u.password === password
    );

    if (!matchedUser) {
      alert('Invalid username or password');
      return;
    }

    
    const fakeToken = btoa(
      JSON.stringify({
        id: matchedUser.id,
        username: matchedUser.username,
        email: matchedUser.email,
        role: matchedUser.role,
        status: matchedUser.status
      })
    );

    
    this.localStorageService.setItem('token', fakeToken);

    
    if (matchedUser.status !== 'active') {
      alert('Your account is not active. Please contact admin.');
      return;
    }

   
    if (matchedUser.role === 'admin') {
      window.location.href = '/admin/manage-user';
    } else {
      window.location.href = '/';
    }
  });
}
}
