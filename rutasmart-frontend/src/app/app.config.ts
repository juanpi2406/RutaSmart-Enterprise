import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; // <-- IMPORTANTE
import { jwtInterceptor } from './service/jwt-interceptor';
import { uppercasePayloadInterceptor } from './service/uppercase-payload-interceptor';
import { apiErrorInterceptor } from './service/api-error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([
      jwtInterceptor,
      uppercasePayloadInterceptor,
      apiErrorInterceptor
    ])),
  ]
};
