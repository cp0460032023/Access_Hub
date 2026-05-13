import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/components/login/login').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/dashboard/dashboard').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'editor'] },
    loadComponent: () =>
      import('./modules/users/components/users-list/users-list').then(
        (m) => m.UsersListComponent
      ),
  },
  {
    path: 'users/new',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./modules/users/components/user-form/user-form').then(
        (m) => m.UserFormComponent
      ),
  },
  {
    path: 'users/edit/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'editor'] },
    loadComponent: () =>
      import('./modules/users/components/user-form/user-form').then(
        (m) => m.UserFormComponent
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/profile/components/profile-edit/profile-edit').then(
        (m) => m.ProfileEditComponent
      ),
  },
  {
    path: 'profile/password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/profile/components/change-password/change-password').then(
        (m) => m.ChangePasswordComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];