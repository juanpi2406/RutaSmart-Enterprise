import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { RUTA_UTP_MALL_DEL_SUR } from '../config/ruta-javier-prado';

export interface PosicionBus {
  lat: number;
  lng: number;
  activo: boolean;
  actualizadoEn: number;
  idViaje?: number;
  indiceParadero?: number;
  progreso?: number;
}

interface CanalAnimacion {
  subject: BehaviorSubject<PosicionBus>;
  clave: string;
  animFrame: number;
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  animStart: number;
  duracionMs: number;
  meta: Omit<PosicionBus, 'lat' | 'lng' | 'actualizadoEn'>;
  inicio: PosicionBus;
}

const INICIO_DEFAULT = RUTA_UTP_MALL_DEL_SUR[0];

function posicionInicial(lat = INICIO_DEFAULT.lat, lng = INICIO_DEFAULT.lng): PosicionBus {
  return { lat, lng, activo: false, actualizadoEn: 0, indiceParadero: 0, progreso: 0 };
}

@Injectable({ providedIn: 'root' })
export class BusTrackingService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly esBrowser = isPlatformBrowser(this.platformId);
  private readonly canales = new Map<string, CanalAnimacion>();
  private readonly clavePrefijo = 'rutasmart-pos-v4-';

  /** Compatibilidad legacy */
  readonly posicion$ = this.posicionRuta$('R-01');
  readonly posicionR02$ = this.posicionRuta$('R-02');

  constructor() {
    if (this.esBrowser) {
      window.addEventListener('storage', (evento) => {
        if (!evento.key?.startsWith(this.clavePrefijo) || !evento.newValue) return;
        const codigo = evento.key.replace(this.clavePrefijo, '');
        try {
          const pos = this.normalizar(JSON.parse(evento.newValue), codigo);
          this.animarCanal(codigo, pos);
        } catch { /* ignore */ }
      });
    }
  }

  posicionRuta$(codigoRuta: string): Observable<PosicionBus> {
    return this.obtenerCanal(codigoRuta).subject.asObservable();
  }

  obtenerActual(): PosicionBus {
    return this.obtenerCanal('R-01').subject.getValue();
  }

  obtenerActualRuta(codigoRuta: string): PosicionBus {
    return this.obtenerCanal(codigoRuta).subject.getValue();
  }

  publicarRuta(
    codigoRuta: string,
    lat: number,
    lng: number,
    activo: boolean,
    idViaje?: number,
    indice?: number,
    durMs?: number
  ): void {
    const pos: PosicionBus = {
      lat, lng, activo, actualizadoEn: Date.now(), idViaje, indiceParadero: indice
    };
    if (this.esBrowser) {
      localStorage.setItem(this.clavePrefijo + codigoRuta, JSON.stringify(pos));
    }
    this.animarCanal(codigoRuta, pos, durMs);
  }

  publicar(
    latOrLeft: number,
    lngOrTop: number,
    activo = true,
    idViaje?: number,
    indiceParadero?: number,
    duracionMs?: number,
    progreso?: number
  ): void {
    this.publicarRuta('R-01', latOrLeft, lngOrTop, activo, idViaje, indiceParadero, duracionMs);
  }

  saltarA(
    codigoRuta: string,
    lat: number,
    lng: number,
    activo = true,
    idViaje?: number,
    indiceParadero?: number
  ): void {
    const canal = this.obtenerCanal(codigoRuta);
    this.cancelarAnimacion(canal);
    const pos: PosicionBus = {
      lat, lng, activo, actualizadoEn: Date.now(), idViaje, indiceParadero
    };
    canal.from = { lat, lng };
    canal.to = { lat, lng };
    canal.subject.next(pos);
    if (this.esBrowser) {
      localStorage.setItem(this.clavePrefijo + codigoRuta, JSON.stringify(pos));
    }
  }

  finalizar(codigoRuta = 'R-01'): void {
    const canal = this.obtenerCanal(codigoRuta);
    const pos = { ...canal.subject.getValue(), activo: false, actualizadoEn: Date.now() };
    this.cancelarAnimacion(canal);
    canal.subject.next(pos);
    if (this.esBrowser) {
      localStorage.setItem(this.clavePrefijo + codigoRuta, JSON.stringify(pos));
    }
  }

  registrarInicioRuta(codigoRuta: string, lat: number, lng: number): void {
    const canal = this.obtenerCanal(codigoRuta);
    canal.inicio = posicionInicial(lat, lng);
  }

  private obtenerCanal(codigoRuta: string): CanalAnimacion {
    const key = codigoRuta || 'R-01';
    if (!this.canales.has(key)) {
      const inicio = posicionInicial();
      const canal: CanalAnimacion = {
        subject: new BehaviorSubject<PosicionBus>(this.leer(key, inicio)),
        clave: this.clavePrefijo + key,
        animFrame: 0,
        from: { lat: inicio.lat, lng: inicio.lng },
        to: { lat: inicio.lat, lng: inicio.lng },
        animStart: 0,
        duracionMs: 3200,
        meta: { activo: false, indiceParadero: 0 },
        inicio
      };
      this.canales.set(key, canal);
    }
    return this.canales.get(key)!;
  }

  /** Borra localStorage y resetea el BehaviorSubject al inicio de la ruta. */
  resetear(codigoRuta: string): void {
    if (this.esBrowser) {
      localStorage.removeItem(this.clavePrefijo + codigoRuta);
    }
    const canal = this.obtenerCanal(codigoRuta);
    const inicio = canal.inicio;
    this.cancelarAnimacion(canal);
    canal.from = { lat: inicio.lat, lng: inicio.lng };
    canal.to = { lat: inicio.lat, lng: inicio.lng };
    canal.subject.next({ ...inicio, activo: false, actualizadoEn: 0 });
  }

  private leer(codigoRuta: string, fallback: PosicionBus): PosicionBus {
    if (!this.esBrowser) return { ...fallback };
    try {
      const raw = JSON.parse(localStorage.getItem(this.clavePrefijo + codigoRuta) ?? '{}');
      const pos = this.normalizar(raw, codigoRuta);
      const age = Date.now() - (pos.actualizadoEn || 0);
      // Solo restaurar si el bus estaba activo y la posición es reciente
      if (!pos.activo || age > 5 * 60 * 1000) {
        return { ...fallback, activo: false };
      }
      return pos;
    } catch {
      return { ...fallback };
    }
  }

  private normalizar(raw: Partial<PosicionBus>, codigoRuta: string): PosicionBus {
    const canal = this.canales.get(codigoRuta);
    const base = canal?.inicio ?? posicionInicial();
    return {
      ...base,
      ...raw,
      lat: raw.lat ?? base.lat,
      lng: raw.lng ?? base.lng
    };
  }

  private animarCanal(codigoRuta: string, destino: PosicionBus, duracionMs?: number): void {
    const canal = this.obtenerCanal(codigoRuta);
    if (!this.esBrowser) {
      canal.subject.next({ ...destino, actualizadoEn: Date.now() });
      return;
    }

    const actual = canal.subject.getValue();
    canal.from = { lat: actual.lat, lng: actual.lng };
    canal.to = { lat: destino.lat, lng: destino.lng };
    canal.animStart = performance.now();
    canal.duracionMs = duracionMs ?? 3200;
    canal.meta = {
      activo: destino.activo,
      idViaje: destino.idViaje,
      indiceParadero: destino.indiceParadero,
      progreso: destino.progreso
    };
    this.cancelarAnimacion(canal);

    const tick = (now: number) => {
      const t = Math.min(1, (now - canal.animStart) / canal.duracionMs);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const lat = canal.from.lat + (canal.to.lat - canal.from.lat) * eased;
      const lng = canal.from.lng + (canal.to.lng - canal.from.lng) * eased;
      canal.subject.next({
        lat, lng,
        activo: canal.meta.activo,
        actualizadoEn: Date.now(),
        idViaje: canal.meta.idViaje,
        indiceParadero: canal.meta.indiceParadero,
        progreso: canal.meta.progreso
      });
      if (t < 1) {
        canal.animFrame = requestAnimationFrame(tick);
      }
    };
    canal.animFrame = requestAnimationFrame(tick);
  }

  private cancelarAnimacion(canal: CanalAnimacion): void {
    if (canal.animFrame) {
      cancelAnimationFrame(canal.animFrame);
      canal.animFrame = 0;
    }
  }
}
