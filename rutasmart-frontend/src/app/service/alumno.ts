import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno } from '../models/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private http = inject(HttpClient);
  private readonly API = 'https://tu-dominio-de-railway.up.railway.app/api/alumnos';

  listar(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.API);
  }

  buscarPorId(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.API}/${id}`);
  }

  buscarPorUsuario(idUsuario: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.API}/usuario/${idUsuario}`);
  }

  guardar(alumno: Partial<Alumno>): Observable<Alumno> {
    return this.http.post<Alumno>(this.API, alumno);
  }

  actualizar(id: number, alumno: Partial<Alumno>): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.API}/${id}`, alumno);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
