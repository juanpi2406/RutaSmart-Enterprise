import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../service/session';

export const authGuard: CanActivateFn = () => {

  const session = inject(SessionService);
  const router = inject(Router);

  if (session.estaLogueado()) {
    return true;
  }

  router.navigate(['/login']);
  return false;

};
