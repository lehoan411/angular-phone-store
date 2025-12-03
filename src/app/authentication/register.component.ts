import { Component,   } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/UserService';
import { User } from '../shared/type/user';


@Component({
  selector: 'register-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./authentication.component.css', '../app.css']
})
export class RegisterComponent {

  register = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })
  get username() {
    return this.register.get('username');
  }
  get email() {
    return this.register.get('email');
  }
  get password() {
    return this.register.get('password');
  }
  constructor(private userService: UserService, private router: Router) {
  }

  handleRegister() {
    if(this.username?.hasError('required') || this.email?.hasError('required') || this.password?.hasError('required')) return;
     const user: User = {
      id: Math.random(),
      username: String(this.username?.value),
      email: String(this.email?.value),
      password: String(this.password?.value),
      role: 'user'
    }
    this.userService.register(user).subscribe((res: any)=> {
      if (res.id) {
        this.router.navigate(['/login']);
      }
    });
  }
}
