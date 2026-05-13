import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const parsedUser = JSON.parse(user);
  const role = parsedUser.role;
  const allowedRoles = route.data?.['roles'] as string[];

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'viewer') {
      router.navigate(['/profile']);
    } else {
      router.navigate(['/dashboard']);
    }
    return false;
  }

  return true;
};
