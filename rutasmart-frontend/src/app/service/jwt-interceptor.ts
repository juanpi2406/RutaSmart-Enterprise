import { HttpInterceptorFn } from '@angular/common/http';
import { ApplicationRef, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { finalize } from 'rxjs';
import { SessionService } from './session';
import { LoadingService } from './loading.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const session = inject(SessionService);
  const applicationRef = inject(ApplicationRef);
  const platformId = inject(PLATFORM_ID);
  const token = session.obtenerToken();
  const loading = inject(LoadingService);

  const actualizarVista = () => {
    if (isPlatformBrowser(platformId)) {
      // La respuesta debe llegar primero al componente; después se actualiza la vista.
      queueMicrotask(() => applicationRef.tick());
    }
  };

  loading.iniciar();

  if (token) {

    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next(cloned).pipe(finalize(() => {
      loading.finalizar();
      actualizarVista();
    }));

  }

  return next(req).pipe(finalize(() => {
    loading.finalizar();
    actualizarVista();
  }));

};
