import { Injectable, computed, signal } from '@angular/core';

/** Mantiene el estado global de las consultas HTTP activas. */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly solicitudesActivas = signal(0);

  readonly cargando = computed(() => this.solicitudesActivas() > 0);

  iniciar(): void {
    this.solicitudesActivas.update((total) => total + 1);
  }

  finalizar(): void {
    this.solicitudesActivas.update((total) => Math.max(0, total - 1));
  }
}
