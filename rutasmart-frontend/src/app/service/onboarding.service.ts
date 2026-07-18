import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly KEY = 'rutasmart-onboarding-v1';
  private readonly esBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  completado(rol: string): boolean {
    if (!this.esBrowser) return true;
    return localStorage.getItem(`${this.KEY}-${rol}`) === '1';
  }

  marcarCompletado(rol: string): void {
    if (!this.esBrowser) return;
    localStorage.setItem(`${this.KEY}-${rol}`, '1');
  }

  pasosParaRol(rol: string): { titulo: string; texto: string; icono: string }[] {
    switch (rol) {
      case 'ALUMNO':
        return [
          { titulo: 'Reserva tu viaje', texto: 'Elige ruta UTP, paradero y asiento desde Reservar Viaje.', icono: 'bi-bookmark-check-fill' },
          { titulo: 'Sigue tu bus', texto: 'En el dashboard verás el mapa en vivo y el ETA a tu paradero.', icono: 'bi-broadcast' },
          { titulo: 'Tu código QR', texto: 'En Mis Reservas muestra el QR al subir al bus.', icono: 'bi-qr-code' }
        ];
      case 'CHOFER':
        return [
          { titulo: 'Inicia el viaje', texto: 'Desde el dashboard pulsa Iniciar Viaje para transmitir GPS.', icono: 'bi-play-circle-fill' },
          { titulo: 'Valida embarques', texto: 'Escanea o ingresa el código QR del alumno.', icono: 'bi-qr-code-scan' },
          { titulo: 'Reporta incidencias', texto: 'Ante cualquier evento usa Reportar Incidencia con ubicación.', icono: 'bi-exclamation-triangle-fill' }
        ];
      default:
        return [
          { titulo: 'Panel UTP', texto: 'Gestiona rutas, paraderos con GPS y monitorea buses en tiempo real.', icono: 'bi-speedometer2' },
          { titulo: 'Paraderos georreferenciados', texto: 'Cada paradero con coordenadas genera mapa y animación automática.', icono: 'bi-geo-alt-fill' }
        ];
    }
  }
}
