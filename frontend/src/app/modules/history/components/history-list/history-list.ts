import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HistoryService, AuditLog } from '../../../../core/services/history';
import { AuthService } from '../../../../core/services/auth';

const ACTION_LABELS: Record<string, string> = {
  login: 'Inicio de sesión',
  register: 'Registro',
  user_created: 'Usuario creado',
  user_updated: 'Usuario actualizado',
  user_deleted: 'Usuario eliminado',
  password_changed: 'Contraseña cambiada',
};

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './history-list.html',
  styleUrl: './history-list.scss',
})
export class HistoryListComponent implements OnInit {
  Math = Math;
  logs: AuditLog[] = [];
  total = 0;
  page = 1;
  limit = 20;
  selectedAction = '';
  search = '';
  isLoading = false;
  errorMessage = '';
  role = '';

  readonly actions = [
    { value: '', label: 'Todas las acciones' },
    { value: 'login', label: 'Inicio de sesión' },
    { value: 'register', label: 'Registro' },
    { value: 'user_created', label: 'Usuario creado' },
    { value: 'user_updated', label: 'Usuario actualizado' },
    { value: 'user_deleted', label: 'Usuario eliminado' },
    { value: 'password_changed', label: 'Contraseña cambiada' },
  ];

  constructor(
    private historyService: HistoryService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.historyService
      .getLogs(this.page, this.limit, this.selectedAction, this.search)
      .subscribe({
        next: (res) => {
          this.logs = res.data;
          this.total = res.total;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Error al cargar el historial';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  onSearch(): void {
    this.page = 1;
    this.loadLogs();
  }

  onActionFilter(): void {
    this.page = 1;
    this.loadLogs();
  }

  nextPage(): void {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.loadLogs();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadLogs();
    }
  }

  actionLabel(action: string): string {
    return ACTION_LABELS[action] ?? action;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
