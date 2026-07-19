import {
  AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges, inject, PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PuntoRuta } from '../../config/ruta-javier-prado';

type LeafletNS = typeof import('leaflet');

@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="leaflet-host" [style.height.px]="altura"></div>`,
  styles: [`
    .leaflet-host { width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,.08); }
    :host { display: block; }
  `]
})
export class LeafletMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() puntos: PuntoRuta[] = [];
  @Input() marcadores: PuntoRuta[] | null = null;
  @Input() altura = 280;
  @Input() busLat?: number;
  @Input() busLng?: number;

  private readonly platformId = inject(PLATFORM_ID);
  private L?: LeafletNS;
  private map?: import('leaflet').Map;
  private capaRuta?: import('leaflet').Polyline;
  private capaBus?: import('leaflet').Marker;
  private hostEl?: HTMLElement;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    void this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;
    if (changes['puntos'] || changes['marcadores']) this.dibujar();
    if (changes['busLat'] || changes['busLng']) this.actualizarBus();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private async initMap(): Promise<void> {
    const host = document.querySelector('.leaflet-host') as HTMLElement;
    if (!host || this.puntos.length < 1 || this.map) return;
    this.hostEl = host;
    const mod = await import('leaflet');
    this.L = ((mod as any).default ?? mod) as LeafletNS;
    const L = this.L;
    this.map = L.map(host, { zoomControl: true, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.dibujar();
  }

  private dibujar(): void {
    if (!this.map || !this.L || this.puntos.length < 2) return;
    const L = this.L;
    this.capaRuta?.remove();
    const latlngs = this.puntos.map(p => [p.lat, p.lng] as [number, number]);
    this.capaRuta = L.polyline(latlngs, { color: '#dc2626', weight: 5, opacity: .85 }).addTo(this.map);
    const stops = this.marcadores?.length ? this.marcadores : this.puntos.filter(p => p.tipo !== 'trayecto');
    stops.forEach((p) => {
      L.circleMarker([p.lat, p.lng], {
        radius: p.tipo === 'origen' || p.tipo === 'destino' ? 8 : 6,
        color: '#fff', weight: 2,
        fillColor: p.tipo === 'destino' ? '#2563eb' : '#dc2626', fillOpacity: 1
      }).bindTooltip(p.etiqueta).addTo(this.map!);
    });
    this.map.fitBounds(this.capaRuta.getBounds(), { padding: [30, 30] });
    this.actualizarBus();
  }

  private actualizarBus(): void {
    if (!this.map || !this.L || this.busLat == null || this.busLng == null) return;
    const L = this.L;
    this.capaBus?.remove();
    const icon = L.divIcon({
      className: 'bus-marker',
      html: '<div style="background:#dc2626;width:28px;height:28px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);"></div>',
      iconSize: [28, 28], iconAnchor: [14, 14]
    });
    this.capaBus = L.marker([this.busLat, this.busLng], { icon }).addTo(this.map);
  }
}
