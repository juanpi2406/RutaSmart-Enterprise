import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ruta } from '../models/ruta';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/rutas';

  listar(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(this.API);
  }
}
