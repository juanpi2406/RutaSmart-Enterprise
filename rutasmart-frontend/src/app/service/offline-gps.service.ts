import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UbicacionBusService } from './ubicacion-bus';

interface PuntoCola {
  idViaje: number;
  latitud: number;
  longitud: number;
  velocidad: number;
  ts: number;
}

@Injectable({ providedIn: 'root' })
export class OfflineGpsService {
  private readonly KEY = 'rutasmart-gps-cola';
  private readonly esBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private ubicacionService = inject(UbicacionBusService);
  private sincronizando = false;

  encolar(punto: Omit<PuntoCola, 'ts'>): void {
    if (!this.esBrowser) return;
    const cola = this.leer();
    cola.push({ ...punto, ts: Date.now() });
    localStorage.setItem(this.KEY, JSON.stringify(cola.slice(-50)));
  }

  sincronizarPendientes(): void {
    if (!this.esBrowser || this.sincronizando) return;
    const cola = this.leer();
    if (!cola.length) return;
    this.sincronizando = true;
    const [primero, ...resto] = cola;
    this.ubicacionService.guardar({
      idViaje: primero.idViaje,
      latitud: primero.latitud,
      longitud: primero.longitud,
      velocidad: primero.velocidad
    }).subscribe({
      next: () => {
        localStorage.setItem(this.KEY, JSON.stringify(resto));
        this.sincronizando = false;
        if (resto.length) this.sincronizarPendientes();
      },
      error: () => {
        this.sincronizando = false;
      }
    });
  }

  publicar(idViaje: number, lat: number, lng: number, velocidad = 28): void {
    if (!navigator.onLine) {
      this.encolar({ idViaje, latitud: lat, longitud: lng, velocidad });
      return;
    }
    this.ubicacionService.guardar({ idViaje, latitud: lat, longitud: lng, velocidad }).subscribe({
      error: () => this.encolar({ idViaje, latitud: lat, longitud: lng, velocidad })
    });
  }

  private leer(): PuntoCola[] {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
