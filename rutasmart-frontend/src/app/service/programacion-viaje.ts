import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgramacionViaje } from '../models/programacion-viaje';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionViajeService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/programaciones';

  listar(): Observable<ProgramacionViaje[]> {
    return this.http.get<ProgramacionViaje[]>(this.API);
  }
}
