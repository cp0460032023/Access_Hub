import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../../../core/services/users';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  user: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.getUser();
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.usersService.changePassword(this.user.id, { currentPassword, newPassword }).subscribe({
      next: () => {
        this.successMessage = 'Contraseña actualizada exitosamente';
        this.isLoading = false;
        this.passwordForm.reset();
        setTimeout(() => this.router.navigate(['/profile']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al cambiar la contraseña';
        this.isLoading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}