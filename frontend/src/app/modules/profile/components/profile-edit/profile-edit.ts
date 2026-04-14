import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../../../core/services/users';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.scss',
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  user: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.usersService.updateProfile(this.user.id, this.profileForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Perfil actualizado exitosamente';
        const newUser = { ...this.user, ...this.profileForm.value };
        localStorage.setItem('user', JSON.stringify(newUser));
        this.user = newUser;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al actualizar perfil';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToChangePassword(): void {
    this.router.navigate(['/profile/password']);
  }
}