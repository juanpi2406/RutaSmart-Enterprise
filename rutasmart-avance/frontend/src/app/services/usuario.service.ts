import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private base = '/api/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.base);
  }

  crear(u: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.base, u);
  }

  actualizar(id: number, u: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.base}/${id}`, u);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
