import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Sesión por pestaña (sessionStorage).
 * localStorage compartía la sesión entre pestañas y al iniciar sesión
 * con otro usuario se pisaba la sesión de las demás.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly KEY = 'usuario';
  private readonly LEGACY_KEY = 'usuario';
  private readonly esBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private get storage(): Storage | null {
    if (!this.esBrowser) return null;
    return sessionStorage;
  }

  guardar(usuario: any): void {
    if (!this.storage) return;
    // Solo esta pestaña: no tocar localStorage (compartido entre pestañas).
    this.storage.setItem(this.KEY, JSON.stringify(usuario));
  }

  obtener(): any {
    if (!this.storage) return null;

    let datos = this.storage.getItem(this.KEY);

    // Migración por pestaña: copia legacy sin borrar localStorage global
    if (!datos) {
      const legacy = localStorage.getItem(this.LEGACY_KEY);
      if (legacy) {
        this.storage.setItem(this.KEY, legacy);
        datos = legacy;
      }
    }

    if (!datos) return null;

    try {
      return JSON.parse(datos);
    } catch {
      return null;
    }
  }

  obtenerNombre(): string {
    const usuario = this.obtener();
    if (!usuario) return '';
    return usuario.nombres + ' ' + usuario.apellidos;
  }

  obtenerRol(): string {
    const usuario = this.obtener();
    if (!usuario) return '';
    return usuario.rol;
  }

  obtenerToken(): string | null {
    const usuario = this.obtener();
    if (!usuario) return null;
    return usuario.token ?? null;
  }

  estaLogueado(): boolean {
    return this.obtener() != null;
  }

  eliminar(): void {
    if (!this.storage) return;
    this.storage.removeItem(this.KEY);
  }
}
