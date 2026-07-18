import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../config/api.config';
import { RutaGeometria, RutaMapaView, colorParaIndice } from '../models/ruta-geometria';
import { Ruta } from '../models/ruta';
import {
  RUTA_UTP_MALL_DEL_SUR,
  RUTA_UTP_POLIDEPORTIVO_VES,
  PuntoRuta
} from '../config/ruta-javier-prado';
import { RutaService } from './ruta';

const PREMIUM: Record<string, PuntoRuta[]> = {
  'R-01': RUTA_UTP_MALL_DEL_SUR,
  'R-02': RUTA_UTP_POLIDEPORTIVO_VES
};

@Injectable({ providedIn: 'root' })
export class RutaMapaService {
  private http = inject(HttpClient);
  private rutaService = inject(RutaService);
  private readonly API = `${API_BASE_URL}/api/rutas`;
  private cache = new Map<number, RutaMapaView>();

  obtenerGeometria(idRuta: number): Observable<RutaGeometria> {
    return this.http.get<RutaGeometria>(`${this.API}/${idRuta}/geometria`);
  }

  cargarMapa(idRuta: number, indiceColor = 0): Observable<RutaMapaView> {
    const cached = this.cache.get(idRuta);
    if (cached) return of(cached);

    return this.obtenerGeometria(idRuta).pipe(
      map((geo) => {
        const mapa = this.enriquecerPremium(geo, indiceColor);
        this.cache.set(idRuta, mapa);
        return mapa;
      }),
      catchError(() => of(this.vacio(idRuta, indiceColor)))
    );
  }

  listarMapeables(): Observable<RutaMapaView[]> {
    return this.rutaService.listar().pipe(
      switchMap((rutas) => {
        const activas = rutas.filter((r) => r.estado);
        if (!activas.length) return of([] as RutaMapaView[]);
        return forkJoin(
          activas.map((r, i) =>
            this.cargarMapa(r.idRuta, i).pipe(
              map((m) => (m.mapeable ? m : null)),
              catchError(() => of(null))
            )
          )
        ).pipe(
          map((lista) => lista.filter((m): m is RutaMapaView => m != null))
        );
      })
    );
  }

  buscarPorCodigo(codigo: string): Observable<Ruta | null> {
    return this.rutaService.listar().pipe(
      map((rutas) => rutas.find((r) => r.codigo === codigo) ?? null)
    );
  }

  invalidarCache(idRuta?: number): void {
    if (idRuta != null) {
      this.cache.delete(idRuta);
    } else {
      this.cache.clear();
    }
  }

  private enriquecerPremium(geo: RutaGeometria, indiceColor: number): RutaMapaView {
    const premium = PREMIUM[geo.codigo];
    const puntos = premium && premium.length >= 2 ? premium : geo.puntos;
    const colores = colorParaIndice(indiceColor);
    const mapeable = geo.mapeable && (puntos.length >= 2 || geo.marcadores.length >= 2);
    return {
      ...geo,
      puntos: puntos.length >= 2 ? puntos : geo.marcadores,
      mapeable,
      colorPrimario: colores.primario,
      colorDestino: colores.destino
    };
  }

  private vacio(idRuta: number, indiceColor: number): RutaMapaView {
    const colores = colorParaIndice(indiceColor);
    return {
      idRuta,
      codigo: '—',
      nombre: 'Ruta',
      origen: '',
      destino: '',
      mapeable: false,
      mensaje: 'No se pudo cargar la geometría.',
      marcadores: [],
      puntos: [],
      colorPrimario: colores.primario,
      colorDestino: colores.destino
    };
  }
}
