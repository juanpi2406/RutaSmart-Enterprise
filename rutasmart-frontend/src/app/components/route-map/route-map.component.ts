import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { BusTrackingService } from '../../service/bus-tracking.service';
import {
  CODIGO_RUTA,
  NOMBRE_RUTA,
  RUTA_UTP_MALL_DEL_SUR,
  PuntoRuta,
  interpolarRuta,
  indiceDesdeProgreso,
  progresoDesdeCoords
} from '../../config/ruta-javier-prado';

export type { PuntoRuta };

@Component({
  selector: 'app-route-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './route-map.component.html',
  styleUrl: './route-map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() autoDemo = false;
  @Input() tituloOrigen = 'UTP Lima Sur';
  @Input() tituloDestino = 'Mall del Sur';
  @Input() rutaPuntos: PuntoRuta[] = RUTA_UTP_MALL_DEL_SUR;
  /** Paradas visibles (origen/paradero/destino). Si no se pasa, se filtran de rutaPuntos. */
  @Input() marcadores: PuntoRuta[] | null = null;
  @Input() rutaCodigo = CODIGO_RUTA;
  @Input() rutaNombre = NOMBRE_RUTA;
  @Input() colorPrimario = '#dc2626';
  @Input() colorDestino = '#2563eb';
  /** ID de la ruta para elegir el canal de tracking: 'R-01' o 'R-02' */
  @Input() rutaId = 'R-01';
  /** Desfase inicial de la demo en ms (para que ambos buses no empiecen igual) */
  @Input() demoOffset = 0;

  @ViewChild('canvasHost', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly tracking = inject(BusTrackingService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly esBrowser = isPlatformBrowser(this.platformId);

  get codigoRuta() { return this.rutaCodigo; }
  get nombreRuta() { return this.rutaNombre; }
  get puntos() { return this.rutaPuntos; }

  get paradas(): PuntoRuta[] {
    if (this.marcadores?.length) return this.marcadores;
    return this.rutaPuntos.filter((p) => p.tipo !== 'trayecto');
  }

  activo = false;
  paraderoActual = 0;
  progresoPct = 0;

  private ctx!: CanvasRenderingContext2D;
  private animRaf = 0;
  private seguimiento?: Subscription;
  private demoProgreso = 0;
  private demoLastTs = 0;
  private liveMode = false;
  private resizeObs?: ResizeObserver;

  /** Posición actual del bus en canvas px */
  private busX = 0;
  private busY = 0;
  private busAngle = 0;
  private pulsePhase = 0;

  /** Proyección de coordenadas a píxeles del canvas */
  private minLat = 0;
  private maxLat = 0;
  private minLng = 0;
  private maxLng = 0;
  private scaleX = 1;
  private scaleY = 1;
  private offX = 0;
  private offY = 0;

  private readonly demoDuracionMs = 32000;
  private readonly PAD = 60;

  get paradasRestantes(): number {
    return Math.max(0, this.paradas.length - 1 - this.paraderoActual);
  }

  get etiquetaEstado(): string {
    if (this.activo) return 'En ruta · vivo';
    if (this.autoDemo) return 'Simulación en vivo';
    return 'En espera';
  }

  get etiquetaParaderoActual(): string {
    return this.paradas[this.paraderoActual]?.etiqueta ?? '—';
  }

  ngAfterViewInit(): void {
    if (!this.esBrowser) return;
    // Defer so grid layout has computed final dimensions before we read clientWidth/Height
    setTimeout(() => {
      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d')!;
      this.ajustarCanvas();

      this.resizeObs = new ResizeObserver(() => { this.ajustarCanvas(); });
      this.resizeObs.observe(canvas.parentElement!);

      this.suscribirTracking();

      const posActual = this.tracking.obtenerActualRuta(this.rutaId);
      if (this.autoDemo && !posActual.activo) {
        this.iniciarDemo();
      } else {
        this.actualizarPosicion(posActual.lat, posActual.lng, posActual.activo, posActual.indiceParadero);
        this.iniciarLoop();
      }
    }, 80);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only react once the canvas is ready (ctx is set inside the 80ms setTimeout)
    if (!this.ctx) return;

    const rutaPuntosChanged = 'rutaPuntos' in changes;
    const rutaIdChanged = 'rutaId' in changes;

    if (rutaPuntosChanged) {
      // Re-project with new route points
      this.calcularProyeccion();
    }

    if (rutaIdChanged) {
      // Re-subscribe to the correct tracking channel
      this.seguimiento?.unsubscribe();
      this.liveMode = false;
      this.suscribirTracking();
    }

    if (rutaPuntosChanged || rutaIdChanged) {
      // Reposition bus at the correct channel's current state
      const posActual = this.tracking.obtenerActualRuta(this.rutaId);
      this.actualizarPosicion(posActual.lat, posActual.lng, posActual.activo, posActual.indiceParadero);
      this.dibujar();
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.seguimiento?.unsubscribe();
    this.detenerLoop();
    this.resizeObs?.disconnect();
  }

  private ajustarCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement!;
    canvas.width = parent.clientWidth || 800;
    canvas.height = parent.clientHeight || 400;
    this.calcularProyeccion();
    this.dibujar();
  }

  private calcularProyeccion(): void {
    const lats = this.puntos.map(p => p.lat);
    const lngs = this.puntos.map(p => p.lng);
    this.minLat = Math.min(...lats);
    this.maxLat = Math.max(...lats);
    this.minLng = Math.min(...lngs);
    this.maxLng = Math.max(...lngs);

    const W = this.canvasRef.nativeElement.width;
    const H = this.canvasRef.nativeElement.height;
    const pad = this.PAD;

    const rangoLng = Math.max(this.maxLng - this.minLng, 0.001);
    const rangoLat = Math.max(this.maxLat - this.minLat, 0.001);

    // Usar escala uniforme para no deformar la ruta — fill the smaller axis
    const scaleByW = (W - pad * 2) / rangoLng;
    const scaleByH = (H - pad * 2) / rangoLat;
    const scale = Math.min(scaleByW, scaleByH);

    this.scaleX = scale;
    this.scaleY = scale;

    // Centrar la ruta en el canvas
    this.offX = (W - rangoLng * scale) / 2;
    this.offY = (H - rangoLat * scale) / 2;
  }

  private project(lat: number, lng: number): [number, number] {
    const x = this.offX + (lng - this.minLng) * this.scaleX;
    // lat crece hacia abajo en pantalla, invertimos
    const H = this.canvasRef.nativeElement.height;
    const y = H - this.offY - (lat - this.minLat) * this.scaleY;
    return [x, y];
  }

  private suscribirTracking(): void {
    this.seguimiento = this.tracking.posicionRuta$(this.rutaId).subscribe(pos => {
      const eraLive = this.liveMode;
      this.liveMode = pos.activo;

      // Arrancar loop render al entrar en modo live (false→true)
      if (pos.activo && !eraLive) {
        this.detenerLoop();
        this.iniciarLoop();
      }

      // Siempre actualizar posición desde el stream en vivo (cubre animación de llegada al destino)
      this.actualizarPosicion(pos.lat, pos.lng, pos.activo, pos.indiceParadero);
      this.cdr.markForCheck();
    });
  }

  private actualizarPosicion(lat: number, lng: number, activo: boolean, indice?: number): void {
    const progreso = progresoDesdeCoords(this.puntos, lat, lng);
    this.progresoPct = progreso * 100;
    this.activo = activo;
    this.paraderoActual = indice ?? indiceDesdeProgreso(this.paradas, progresoDesdeCoords(this.paradas, lat, lng));
    const [x, y] = this.project(lat, lng);
    this.busX = x;
    this.busY = y;
    const next = interpolarRuta(this.puntos, Math.min(0.999, progreso + 0.002));
    const [nx, ny] = this.project(next.lat, next.lng);
    this.busAngle = Math.atan2(ny - y, nx - x);
  }

  private iniciarDemo(): void {
    // Offset so R-02 bus doesn't start at same position as R-01
    this.demoProgreso = (this.demoOffset % this.demoDuracionMs) / this.demoDuracionMs;
    this.demoLastTs = 0;
    const tick = (ts: number) => {
      if (this.liveMode) return;
      if (!this.demoLastTs) this.demoLastTs = ts;
      const dt = ts - this.demoLastTs;
      this.demoLastTs = ts;

      this.demoProgreso += dt / this.demoDuracionMs;
      if (this.demoProgreso >= 1) {
        this.demoProgreso = 0;
        this.demoLastTs = 0;
      }

      const t = this.demoProgreso;
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const pos = interpolarRuta(this.puntos, eased);
      this.actualizarPosicion(pos.lat, pos.lng, false, indiceDesdeProgreso(this.puntos, eased));

      this.pulsePhase = (ts / 800) % (Math.PI * 2);
      this.dibujar();
      this.cdr.markForCheck();
      this.animRaf = requestAnimationFrame(tick);
    };
    this.animRaf = requestAnimationFrame(tick);
  }

  private iniciarLoop(): void {
    const tick = (ts: number) => {
      this.pulsePhase = (ts / 800) % (Math.PI * 2);
      this.dibujar();
      this.animRaf = requestAnimationFrame(tick);
    };
    this.animRaf = requestAnimationFrame(tick);
  }

  private detenerLoop(): void {
    if (this.animRaf) {
      cancelAnimationFrame(this.animRaf);
      this.animRaf = 0;
    }
  }

  private dibujar(): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const W = this.canvasRef.nativeElement.width;
    const H = this.canvasRef.nativeElement.height;

    // Fondo con gradiente
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#1e293b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grid sutil
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const pxPuntos = this.puntos.map(p => this.project(p.lat, p.lng));

    // —— Ruta completa (sombra) ——
    ctx.beginPath();
    ctx.moveTo(pxPuntos[0][0], pxPuntos[0][1]);
    for (let i = 1; i < pxPuntos.length; i++) {
      this.curveThrough(ctx, pxPuntos, i);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // —— Ruta completa (base gris) ——
    ctx.beginPath();
    ctx.moveTo(pxPuntos[0][0], pxPuntos[0][1]);
    for (let i = 1; i < pxPuntos.length; i++) {
      this.curveThrough(ctx, pxPuntos, i);
    }
    ctx.strokeStyle = 'rgba(100,116,139,0.55)';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // —— Ruta completada (glow rojo) ——
    const progreso = this.progresoPct / 100;
    if (progreso > 0.005) {
      const cutIdx = Math.floor(progreso * (this.puntos.length - 1));
      const pxCut = pxPuntos.slice(0, cutIdx + 2);
      if (pxCut.length >= 2) {
        // glow
        ctx.beginPath();
        ctx.moveTo(pxCut[0][0], pxCut[0][1]);
        for (let i = 1; i < pxCut.length; i++) {
          this.curveThrough(ctx, pxCut, i);
        }
        ctx.strokeStyle = this.colorPrimario + '4d';
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // línea principal
        ctx.beginPath();
        ctx.moveTo(pxCut[0][0], pxCut[0][1]);
        for (let i = 1; i < pxCut.length; i++) {
          this.curveThrough(ctx, pxCut, i);
        }
        const grad = ctx.createLinearGradient(pxCut[0][0], pxCut[0][1], this.busX, this.busY);
        grad.addColorStop(0, '#f97316');
        grad.addColorStop(1, this.colorPrimario);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 7;
        ctx.stroke();

        // borde blanco fino encima
        ctx.beginPath();
        ctx.moveTo(pxCut[0][0], pxCut[0][1]);
        for (let i = 1; i < pxCut.length; i++) {
          this.curveThrough(ctx, pxCut, i);
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // —— Paraderos ——
    this.paradas.forEach((p, i) => {
      const idxEnPoly = this.puntos.findIndex(
        (pt) => pt.tipo === p.tipo && Math.abs(pt.lat - p.lat) < 0.0001 && Math.abs(pt.lng - p.lng) < 0.0001
      );
      const pi = idxEnPoly >= 0 ? idxEnPoly : Math.min(i, pxPuntos.length - 1);
      const [x, y] = pxPuntos[pi] ?? pxPuntos[0];
      const esExtremo = p.tipo === 'origen' || p.tipo === 'destino';
      const visitado = i <= this.paraderoActual;
      const esActual = i === this.paraderoActual;

      if (esExtremo) {
        // Anillo grande para origen/destino
        const color = p.tipo === 'origen' ? this.colorPrimario : this.colorDestino;
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fillStyle = color + '33';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Etiqueta
        ctx.font = 'bold 11px Inter, system-ui, sans-serif';
        ctx.textAlign = p.tipo === 'origen' ? 'left' : 'right';
        const lx = p.tipo === 'origen' ? x + 14 : x - 14;
        const ly = y - 14;
        const txt = p.etiqueta;
        const tw = ctx.measureText(txt).width;
        const bx = p.tipo === 'origen' ? lx - 4 : lx - tw - 4;
        ctx.fillStyle = color + 'cc';
        ctx.beginPath();
        ctx.roundRect(bx, ly - 13, tw + 8, 18, 5);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillText(txt, lx, ly);

      } else {
        // Paradero normal
        const r = esActual ? 7 : 5;
        ctx.beginPath();
        ctx.arc(x, y, r + 3, 0, Math.PI * 2);
        ctx.fillStyle = esActual ? 'rgba(220,38,38,0.25)' : 'transparent';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = visitado ? (esActual ? '#dc2626' : '#f97316') : '#334155';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Número del paradero
        if (p.numero != null) {
          ctx.font = `bold ${esActual ? 9 : 8}px Inter, system-ui, sans-serif`;
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.fillText(String(p.numero), x, y + 3);
        }
      }
    });

    // —— Bus ——
    if (this.busX || this.busY) {
      this.dibujarBus(ctx, this.busX, this.busY, this.busAngle);
    }
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
  }

  private curveThrough(ctx: CanvasRenderingContext2D, pts: [number, number][], i: number): void {
    // Catmull-Rom suavizado
    if (i === 0 || pts.length < 2) return;
    if (pts.length === 2 || i === pts.length - 1) {
      ctx.lineTo(pts[i][0], pts[i][1]);
      return;
    }
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const cpx = (p0[0] + p1[0]) / 2;
    const cpy = (p0[1] + p1[1]) / 2;
    ctx.quadraticCurveTo(p0[0], p0[1], cpx, cpy);
    if (i === pts.length - 1) ctx.lineTo(p1[0], p1[1]);
  }

  private dibujarBus(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number): void {
    const pulse = (Math.sin(this.pulsePhase) + 1) / 2; // 0..1
    const pulseR = 22 + pulse * 12;
    const pulseAlpha = 0.45 - pulse * 0.4;

    // Pulso exterior
    ctx.beginPath();
    ctx.arc(x, y, pulseR, 0, Math.PI * 2);
    ctx.fillStyle = this.hexToRgba(this.colorPrimario, pulseAlpha);
    ctx.fill();

    // Segundo anillo
    const p2 = (Math.sin(this.pulsePhase + Math.PI) + 1) / 2;
    const pulse2R = 18 + p2 * 10;
    ctx.beginPath();
    ctx.arc(x, y, pulse2R, 0, Math.PI * 2);
    ctx.fillStyle = this.hexToRgba(this.colorPrimario, 0.3 - p2 * 0.28);
    ctx.fill();

    // Sombra
    ctx.beginPath();
    ctx.ellipse(x, y + 20, 14, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fill();

    // Cuerpo del bus (círculo rotado)
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Gradiente radial del cuerpo
    const grd = ctx.createRadialGradient(-5, -5, 2, 0, 0, 20);
    grd.addColorStop(0, this.colorPrimario + 'dd');
    grd.addColorStop(1, this.colorPrimario);

    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Icono bus (dibujado a mano como rectángulo simplificado)
    ctx.fillStyle = '#fff';
    // Carrocería
    ctx.beginPath();
    ctx.roundRect(-8, -6, 16, 11, 2);
    ctx.fill();
    ctx.fillStyle = '#991b1b';
    // Ventana frontal
    ctx.fillRect(-5, -4, 10, 5);
    // Ruedas
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(-5, 5, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, 5, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-5, 5, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, 5, 1.2, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }
}
