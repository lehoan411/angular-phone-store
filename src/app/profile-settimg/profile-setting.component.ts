import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/UserService';
import { User } from '../shared/type/user';
import { LocalStorageService } from '../shared/storage/local-storage.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'profile-setting-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedTab: 'profile' | 'password' = 'profile';

  previewAvatar: string | null | undefined = null;
  selectedFile: File | null = null;

  currentUser!: User;

  profileForm = new FormGroup({
    avatar: new FormControl(''),
    email: new FormControl('', Validators.required),
    address: new FormControl(''),
    phone: new FormControl(''),
  });

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = this.localStorageService.getItem('token');
    const userId = token ? JSON.parse(atob(token)).id : null;

    if (userId) {
      this.userService.getUserById(userId).subscribe((res: User) => {
        this.currentUser = res;

        this.profileForm.patchValue({
          avatar: res.avatar,
          email: res.email,
          address: res.address,
          phone: res.phone
        });

        this.previewAvatar = res.avatar;

        this.cdr.detectChanges();
      });
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  handleAvatarChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewAvatar = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  async handleProfileUpdate() {
    if (this.profileForm.invalid) return;

    let avatarUrl = this.currentUser.avatar;

    if (this.selectedFile) {
      const uploadedUrl = await this.uploadToCloudinary(this.selectedFile);
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
        this.previewAvatar = uploadedUrl; 
      }
    }

    const updatedUser: User = {
      ...this.currentUser,
      avatar: avatarUrl,
      email: this.profileForm.value.email!,
      address: this.profileForm.value.address!,
      phone: this.profileForm.value.phone!
    };

    this.userService.editUser(updatedUser).subscribe(() => {
      this.currentUser = updatedUser;
      alert("Update successful!");
    });
  }

  async uploadToCloudinary(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "medical_unsigned");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/ds79he1wa/image/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      return data.secure_url || null;

    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  }

  handleChangePassword() {
    if (this.passwordForm.invalid) return;

    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    if (this.passwordForm.value.currentPassword !== this.currentUser.password) {
      alert("Current password is incorrect!");
      return;
    }

    const updatedUser: User = {
      ...this.currentUser,
      password: this.passwordForm.value.newPassword!
    };

    this.userService.editUser(updatedUser).subscribe(() => {
      alert("Password changed successfully!");
      this.passwordForm.reset();
    });
  }
}
