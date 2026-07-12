import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models';

interface MeResponse {
  name: string;
  role: string;
  correo: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/auth';
  user = signal<MeResponse | null>(this.cargarLocal());

  constructor(private http: HttpClient, private router: Router) {}

  login(usuario: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/login`, { usuario, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('rs_token', res.token);
          const u = { name: res.name, role: res.role, correo: '' };
          localStorage.setItem('rs_user', JSON.stringify(u));
          this.user.set(u);
        })
      );
  }

  me(): Observable<MeResponse> {
    return this.http
      .get<MeResponse>(`${this.base}/me`)
      .pipe(tap((u) => {
        localStorage.setItem('rs_user', JSON.stringify(u));
        this.user.set(u);
      }));
  }

  logout() {
    localStorage.removeItem('rs_token');
    localStorage.removeItem('rs_user');
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  private cargarLocal(): MeResponse | null {
    const raw = localStorage.getItem('rs_user');
    return raw ? JSON.parse(raw) : null;
  }
}
