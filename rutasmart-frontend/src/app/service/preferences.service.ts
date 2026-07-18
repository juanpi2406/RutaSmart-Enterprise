import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface UserPreferences {
  notificacionesEmail: boolean;
  alertasViaje: boolean;
  recordatoriosReserva: boolean;
  sidebarCompacto: boolean;
  avatarColor: string;
}

const DEFAULT: UserPreferences = {
  notificacionesEmail: true,
  alertasViaje: true,
  recordatoriosReserva: true,
  sidebarCompacto: false,
  avatarColor: '#dc2626'
};

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly key = 'rutasmart-preferencias';
  private readonly esBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  obtener(): UserPreferences {
    if (!this.esBrowser) return { ...DEFAULT };
    try {
      return { ...DEFAULT, ...JSON.parse(localStorage.getItem(this.key) ?? '{}') };
    } catch {
      return { ...DEFAULT };
    }
  }

  guardar(prefs: Partial<UserPreferences>): UserPreferences {
    const merged = { ...this.obtener(), ...prefs };
    if (this.esBrowser) {
      localStorage.setItem(this.key, JSON.stringify(merged));
    }
    return merged;
  }

  restablecer(): UserPreferences {
    if (this.esBrowser) {
      localStorage.removeItem(this.key);
    }
    return { ...DEFAULT };
  }
}
