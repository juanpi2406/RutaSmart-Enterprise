import { Injectable, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { UbicacionBus } from '../models/ubicacion-bus';

export interface WsMensaje {
  tipo: string;
  data: unknown;
}

@Injectable({ providedIn: 'root' })
export class WebsocketService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly esBrowser = isPlatformBrowser(this.platformId);
  private socket?: WebSocket;
  private mensajes$ = new Subject<WsMensaje>();
  private reconectarTimer?: ReturnType<typeof setTimeout>;
  private reconectado$ = new Subject<void>();

  ngOnDestroy(): void {
    this.desconectar();
  }

  conectar(): void {
    if (!this.esBrowser || this.socket?.readyState === WebSocket.OPEN) return;

    const wsUrl = API_BASE_URL.replace(/^http/, 'ws') + '/ws/tracking';
    try {
      this.socket = new WebSocket(wsUrl);
      this.socket.onopen = () => this.reconectado$.next();
      this.socket.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data) as WsMensaje;
          this.mensajes$.next(msg);
        } catch { /* ignore */ }
      };
      this.socket.onclose = () => {
        this.reconectarTimer = setTimeout(() => this.conectar(), 5000);
      };
      this.socket.onerror = () => {
        this.socket?.close();
      };
    } catch { /* ignore */ }
  }

  desconectar(): void {
    if (this.reconectarTimer) clearTimeout(this.reconectarTimer);
    this.socket?.close();
    this.socket = undefined;
  }

  escuchar(): Observable<WsMensaje> {
    return this.mensajes$.asObservable();
  }

  alConectar(): Observable<void> {
    return this.reconectado$.asObservable();
  }

  escucharUbicaciones(): Observable<UbicacionBus> {
    return new Observable((sub) => {
      const subInterno = this.mensajes$.subscribe((msg) => {
        if (msg.tipo === 'UBICACION') {
          sub.next(msg.data as UbicacionBus);
        }
      });
      return () => subInterno.unsubscribe();
    });
  }
}
