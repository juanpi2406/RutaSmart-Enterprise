import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

export interface ThemeSettings {
  modoOscuro: boolean;
  colorPrincipal: string;
  colorSecundario: string;
}

const DEFAULT_THEME: ThemeSettings = {
  modoOscuro: true,
  colorPrincipal: '#dc2626',
  colorSecundario: '#991b1b'
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'rutasmart-theme-carmen';

  inicializar(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.aplicar(this.obtener());
    }
  }

  obtener(): ThemeSettings {
    if (!isPlatformBrowser(this.platformId)) return { ...DEFAULT_THEME };

    try {
      return { ...DEFAULT_THEME, ...JSON.parse(localStorage.getItem(this.storageKey) ?? '{}') };
    } catch {
      return { ...DEFAULT_THEME };
    }
  }

  aplicar(tema: ThemeSettings): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const raiz = this.document.documentElement;
    raiz.dataset['theme'] = tema.modoOscuro ? 'dark' : 'light';
    raiz.style.setProperty('--color-principal', tema.colorPrincipal);
    raiz.style.setProperty('--color-secundario', tema.colorSecundario);

    localStorage.setItem(this.storageKey, JSON.stringify(tema));
  }

  restablecer(): ThemeSettings {
    const tema = { ...DEFAULT_THEME };
    this.aplicar(tema);
    return tema;
  }
}
