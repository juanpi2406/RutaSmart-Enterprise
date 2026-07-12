import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno } from '../models/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/alumnos';

  listar(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.API);
  }

  buscarPorId(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.API}/${id}`);
  }

  buscarPorUsuario(idUsuario: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.API}/usuario/${idUsuario}`);
  }
}
