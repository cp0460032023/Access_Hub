import { Component, OnInit } from '@angular/core';
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
  Math = Math; // Para usar funciones matemáticas en el template
  users: User[] = [];
  total: number = 0;
  page: number = 1;
  limit: number = 10;
  search: string = '';
  selectedRole: string = '';
  isLoading: boolean = false;
  role: string = '';
  errorMessage: string = '';

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers(this.page, this.limit, this.search, this.selectedRole).subscribe({
      next: (response: any) => {
        if (response.statusCode === 403) {
          this.errorMessage = response.message;
          this.isLoading = false;
          return;
        }
        this.users = response.data || [];
        this.total = response.total || 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar usuarios';
        this.isLoading = false;
      },
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadUsers();
  }

  onRoleFilter(): void {
    this.page = 1;
    this.loadUsers();
  }

  nextPage(): void {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }

  editUser(id: string): void {
    this.router.navigate(['/users/edit', id]);
  }

  deleteUser(id: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: () => alert('Error al eliminar usuario'),
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isEditor(): boolean {
    return this.role === 'editor';
  }
}