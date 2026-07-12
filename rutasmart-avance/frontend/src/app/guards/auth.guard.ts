import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const token = localStorage.getItem('rs_token');
  const router = inject(Router);
  if (token) return true;
  router.navigate(['/login']);
  return false;
};
