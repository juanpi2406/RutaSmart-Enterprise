import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/usuario';
import { Viaje } from '../models/viaje';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/viajes';

  listar(): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(this.API);
  }

  listarPorRutaYFecha(idRuta: number, fechaViaje: string): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${this.API}/buscar`, {
      params: {
        ruta: idRuta.toString(),
        fechaViaje: fechaViaje
      }
    });
  }

  buscarPorId(id: number): Observable<Viaje> {
    return this.http.get<Viaje>(`${this.API}/${id}`);
  }
}
