import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ruta } from '../models/ruta';
import { LimpiezaSinGps } from '../models/limpieza-sin-gps';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private http = inject(HttpClient);
  private readonly API = `${API_BASE_URL}/api/rutas`;

  listar(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(this.API);
  }

  buscarPorId(id: number): Observable<Ruta> {
    return this.http.get<Ruta>(`${this.API}/${id}`);
  }

  guardar(ruta: Partial<Ruta>): Observable<Ruta> {
    return this.http.post<Ruta>(this.API, ruta);
  }

  actualizar(id: number, ruta: Partial<Ruta>): Observable<Ruta> {
    return this.http.put<Ruta>(`${this.API}/${id}`, ruta);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  limpiarSinGps(): Observable<LimpiezaSinGps> {
    return this.http.post<LimpiezaSinGps>(`${this.API}/limpiar-sin-gps`, {});
  }
}
