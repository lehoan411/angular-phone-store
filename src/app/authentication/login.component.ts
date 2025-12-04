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
    if (this.username?.hasError('required') || this.password?.hasError('required')) return;
    const user = {
      username: String(this.username?.value),
      password: String(this.password?.value),
    }
     this.userService.getUsers().subscribe((res: any) => {
      const matchedUser = res.find((u: User) => u.username === user.username && u.password === user.password);
      if (!matchedUser) {
        alert('Invalid username or password');
        return;
      }
      console.log(matchedUser);
      if (matchedUser) {
        this.localStorageService.setItem('user', JSON.stringify({
          id: matchedUser.id,
          role: matchedUser.role
        }));
        this.router.navigate(['/']);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });
  }
}
