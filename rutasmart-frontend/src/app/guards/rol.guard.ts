import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../service/session';

export const rolGuard: CanActivateFn = (route) => {

  const session = inject(SessionService);
  const router = inject(Router);

  const rolesPermitidos = route.data?.['roles'] as string[] | undefined;

  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return true;
  }

  const rolActual = session.obtenerRol();

  if (rolesPermitidos.includes(rolActual)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;

};
