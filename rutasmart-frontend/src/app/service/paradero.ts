import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paradero } from '../models/paradero';

@Injectable({
  providedIn: 'root'
})
export class ParaderoService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/paraderos';

  listar(): Observable<Paradero[]> {
    return this.http.get<Paradero[]>(this.API);
  }

  listarPorRuta(idRuta: number): Observable<Paradero[]> {
    return this.http.get<Paradero[]>(`${this.API}/ruta/${idRuta}`);
  }

  buscarPorId(id: number): Observable<Paradero> {
    return this.http.get<Paradero>(`${this.API}/${id}`);
  }

  guardar(paradero: Partial<Paradero>): Observable<Paradero> {
    return this.http.post<Paradero>(this.API, paradero);
  }

  actualizar(id: number, paradero: Partial<Paradero>): Observable<Paradero> {
    return this.http.put<Paradero>(`${this.API}/${id}`, paradero);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
