import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from './session';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const session = inject(SessionService);
  const token = session.obtenerToken();

  if (token) {

    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next(cloned);

  }

  return next(req);

};
