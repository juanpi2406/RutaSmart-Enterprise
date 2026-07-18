import { HttpInterceptorFn } from '@angular/common/http';
import { ApplicationRef, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { finalize } from 'rxjs';
import { SessionService } from './session';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);
  const applicationRef = inject(ApplicationRef);
  const platformId = inject(PLATFORM_ID);
  const token = session.obtenerToken();

  const actualizarVista = () => {
    if (isPlatformBrowser(platformId)) {
      queueMicrotask(() => applicationRef.tick());
    }
  };

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(finalize(() => actualizarVista()));
};
