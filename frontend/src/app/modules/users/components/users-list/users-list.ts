import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService, User } from '../../../../core/services/users';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersListComponent implements OnInit {
  Math = Math;
  users: User[] = [];
  total: number = 0;
  page: number = 1;
  limit: number = 10;
  search: string = '';
  selectedRole: string = '';
  isLoading: boolean = false;
  role: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    const nav = window.history.state;
    if (nav?.message) {
      setTimeout(() => {
        this.successMessage = nav.message;
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
      }, 0);
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.usersService.getUsers(this.page, this.limit, this.search, this.selectedRole).subscribe({
      next: (response: any) => {
        this.users = response.data || [];
        this.total = response.total || 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al cargar usuarios';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void { this.page = 1; this.loadUsers(); }
  onRoleFilter(): void { this.page = 1; this.loadUsers(); }

  nextPage(): void {
    if (this.page * this.limit < this.total) { this.page++; this.loadUsers(); }
  }

  prevPage(): void {
    if (this.page > 1) { this.page--; this.loadUsers(); }
  }

  editUser(id: string): void {
    this.router.navigate(['/users/edit', id]);
  }

  deleteUser(id: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          setTimeout(() => {
            this.successMessage = 'Usuario eliminado exitosamente';
            this.cdr.detectChanges();
            setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
            this.loadUsers();
          }, 0);
        },
        error: () => {
          setTimeout(() => {
            this.errorMessage = 'Error al eliminar usuario';
            this.cdr.detectChanges();
          }, 0);
        },
      });
    }
  }

  goBack(): void { this.router.navigate(['/dashboard']); }
  isAdmin(): boolean { return this.role === 'admin'; }
  isEditor(): boolean { return this.role === 'editor'; }
}