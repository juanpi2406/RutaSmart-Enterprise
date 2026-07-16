import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface PosicionBus {
  left: number;
  top: number;
  activo: boolean;
  actualizadoEn: number;
}

const POSICION_INICIAL: PosicionBus = { left: 72, top: 84, activo: false, actualizadoEn: 0 };

/**
 * Canal de demostración para compartir el movimiento del bus entre paneles.
 * Para producción puede sustituirse por WebSocket o por el API de ubicaciones.
 */
@Injectable({ providedIn: 'root' })
export class BusTrackingService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly esBrowser = isPlatformBrowser(this.platformId);
  private readonly clave = 'rutasmart-posicion-bus-demo';
  private readonly subject = new BehaviorSubject<PosicionBus>(this.leer());

  readonly posicion$ = this.subject.asObservable();

  constructor() {
    if (this.esBrowser) {
      window.addEventListener('storage', (evento) => {
        if (evento.key === this.clave) this.subject.next(this.leer());
      });
    }
  }

  publicar(left: number, top: number, activo = true): void {
    const posicion: PosicionBus = { left, top, activo, actualizadoEn: Date.now() };
    this.subject.next(posicion);
    if (this.esBrowser) localStorage.setItem(this.clave, JSON.stringify(posicion));
  }

  finalizar(): void {
    const posicion = { ...this.subject.value, activo: false, actualizadoEn: Date.now() };
    this.subject.next(posicion);
    if (this.esBrowser) localStorage.setItem(this.clave, JSON.stringify(posicion));
  }

  private leer(): PosicionBus {
    if (!this.esBrowser) return { ...POSICION_INICIAL };
    try {
      const posicion = { ...POSICION_INICIAL, ...JSON.parse(localStorage.getItem(this.clave) ?? '{}') };
      // Evita presentar como activo un viaje abandonado en una demostración anterior.
      return Date.now() - posicion.actualizadoEn > 5 * 60 * 1000
        ? { ...posicion, activo: false }
        : posicion;
    } catch {
      return { ...POSICION_INICIAL };
    }
  }
}
