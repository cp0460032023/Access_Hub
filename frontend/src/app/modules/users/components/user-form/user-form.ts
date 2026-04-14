import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UsersService } from '../../../../core/services/users';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  userId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      role: ['viewer', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.isEditMode = true;
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.loadUser();
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  loadUser(): void {
    this.usersService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
        });
      },
      error: () => {
        this.errorMessage = 'Error al cargar usuario';
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.userForm.value;

    if (this.isEditMode) {
      const updateData: any = {
        name: formValue.name,
        email: formValue.email,
        role: formValue.role,
      };
      this.usersService.updateUser(this.userId, updateData).subscribe({
        next: () => {
          this.successMessage = 'Usuario actualizado exitosamente';
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/users']), 1500);
        },
        error: () => {
          this.errorMessage = 'Error al actualizar usuario';
          this.isLoading = false;
        },
      });
    } else {
      this.usersService.createUser(formValue).subscribe({
        next: () => {
          this.successMessage = 'Usuario creado exitosamente';
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/users']), 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al crear usuario';
          this.isLoading = false;
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}