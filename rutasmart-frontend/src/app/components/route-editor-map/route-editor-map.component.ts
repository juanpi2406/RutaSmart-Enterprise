import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { PuntoEdicionRuta } from '../../models/punto-edicion-ruta';

type LeafletNS = typeof import('leaflet');

@Component({
  selector: 'app-route-editor-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="route-editor-map">
      <div #mapHost class="route-editor-map__canvas"></div>
      <p class="route-editor-map__hint">
        <i class="bi bi-cursor-fill"></i>
        Clic en el mapa para marcar origen, paradas y destino (mínimo 2 puntos).
      </p>
    </div>
  `,
  styles: [`
    .route-editor-map { display: flex; flex-direction: column; gap: 8px; }
    .route-editor-map__canvas {
      width: 100%;
      height: 340px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.1);
    }
    .route-editor-map__hint {
      margin: 0;
      font-size: 12px;
      color: rgba(255,255,255,.55);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    @media (max-width: 768px) {
      .route-editor-map__canvas { height: 260px; }
    }
    @media (max-width: 480px) {
      .route-editor-map__canvas { height: 220px; }
      .route-editor-map__hint { font-size: 11px; }
    }
  `]
})
export class RouteEditorMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() puntos: PuntoEdicionRuta[] = [];
  @Input() centroLat = -12.19;
  @Input() centroLng = -76.94;
  @Input() zoom = 13;

  @Output() puntosChange = new EventEmitter<PuntoEdicionRuta[]>();

  @ViewChild('mapHost', { static: true }) mapHost!: ElementRef<HTMLElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private L?: LeafletNS;
  private map?: import('leaflet').Map;
  private capaLinea?: import('leaflet').Polyline;
  private capaMarcadores?: import('leaflet').LayerGroup;
  private listo = false;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    void this.inicializar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.listo || !changes['puntos']) return;
    this.redibujar();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private async inicializar(): Promise<void> {
    const host = this.mapHost?.nativeElement;
    if (!host || this.map) return;

    const mod = await import('leaflet');
    this.L = ((mod as any).default ?? mod) as LeafletNS;
    const L = this.L;

    this.map = L.map(host, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.capaMarcadores = L.layerGroup().addTo(this.map);
    this.map.setView([this.centroLat, this.centroLng], this.zoom);

    this.map.on('click', (evento) => {
      const orden = this.puntos.length + 1;
      const nuevos = [
        ...this.puntos,
        {
          lat: +evento.latlng.lat.toFixed(6),
          lng: +evento.latlng.lng.toFixed(6),
          nombre: orden === 1 ? 'Origen' : `Parada ${orden}`,
          orden
        }
      ];
      this.puntosChange.emit(nuevos);
    });

    this.listo = true;
    this.redibujar();
  }

  private redibujar(): void {
    if (!this.map || !this.L || !this.capaMarcadores) return;

    const L = this.L;

    this.capaMarcadores.clearLayers();
    this.capaLinea?.remove();

    if (!this.puntos.length) {
      this.map.setView([this.centroLat, this.centroLng], this.zoom);
      return;
    }

    const latlngs = this.puntos.map((p) => [p.lat, p.lng] as [number, number]);

    if (this.puntos.length >= 2) {
      this.capaLinea = L.polyline(latlngs, {
        color: '#dc2626',
        weight: 4,
        opacity: 0.85,
        dashArray: '6 4'
      }).addTo(this.map);
    }

    this.puntos.forEach((p, i) => {
      const esOrigen = i === 0;
      const esDestino = i === this.puntos.length - 1 && this.puntos.length > 1;
      const color = esDestino ? '#2563eb' : '#dc2626';

      L.circleMarker([p.lat, p.lng], {
        radius: esOrigen || esDestino ? 9 : 7,
        color: '#fff',
        weight: 2,
        fillColor: color,
        fillOpacity: 1
      })
        .bindTooltip(`${i + 1}. ${p.nombre}`, { permanent: false, direction: 'top' })
        .addTo(this.capaMarcadores!);
    });

    const bounds = L.latLngBounds(latlngs);
    this.map.fitBounds(bounds, { padding: [36, 36], maxZoom: 15 });
  }
}
