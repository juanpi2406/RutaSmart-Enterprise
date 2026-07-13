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
      // La respuesta debe llegar primero al componente; después se actualiza la vista.
      queueMicrotask(() => applicationRef.tick());
    }
  };

  if (token) {

    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next(cloned).pipe(finalize(actualizarVista));

  }

  return next(req).pipe(finalize(actualizarVista));

};
