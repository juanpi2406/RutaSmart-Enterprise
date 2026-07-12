import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/usuario';
import { Paradero } from '../models/paradero';

@Injectable({
  providedIn: 'root'
})
export class ParaderoService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/paraderos';

  listar(): Observable<ApiResponse<Paradero[]>> {
    return this.http.get<ApiResponse<Paradero[]>>(this.API);
  }

  listarPorRuta(idRuta: number): Observable<Paradero[]> {
    return this.http.get<Paradero[]>(`${this.API}/ruta/${idRuta}`);
  }
}
