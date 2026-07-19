import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  inject,
  ElementRef,
  ViewChild,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { SessionService } from '../../service/session';
import { DashboardService } from '../../service/dashboard';
import { BusTrackingService } from '../../service/bus-tracking.service';
import { UbicacionBusService } from '../../service/ubicacion-bus';
import { ViajeService } from '../../service/viaje';
import { RutaMapaService } from '../../service/ruta-mapa.service';
import { WebsocketService } from '../../service/websocket.service';
import { OfflineGpsService } from '../../service/offline-gps.service';
import { EtaService, EtaInfo } from '../../service/eta.service';
import { ReservaService } from '../../service/reserva';
import { AlumnoService } from '../../service/alumno';
import { Alumno } from '../../models/alumno';
import { ActividadReciente, ReservaPorDia } from '../../models/dashboardAdmin';
import { DashboardChofer } from '../../models/dashboardChofer';
import { RutaMapaView } from '../../models/ruta-geometria';
import { RouteMapComponent } from '../../components/route-map/route-map.component';
import { PuntoRuta } from '../../config/ruta-javier-prado';
import Swal from 'sweetalert2';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouteMapComponent, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class DashboardHomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartReservas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  private session = inject(SessionService);
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  private trackingBus = inject(BusTrackingService);
  private ubicacionService = inject(UbicacionBusService);
  private viajeService = inject(ViajeService);
  private rutaMapaService = inject(RutaMapaService);
  private wsService = inject(WebsocketService);
  private offlineGps = inject(OfflineGpsService);
  private etaService = inject(EtaService);
  private reservaService = inject(ReservaService);
  private alumnoService = inject(AlumnoService);
  private router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly esBrowser = isPlatformBrowser(this.platformId);

  private onlineHandler = () => this.offlineGps.sincronizarPendientes();

  private simulacion?: Subscription;
  private seguimiento?: Subscription;
  private pollUbicacion?: Subscription;
  private pollDashboard?: Subscription;
  private chart?: Chart;

  viajeIniciado = false;
  ultimaActualizacion = 0;
  idViajeActivo?: number;
  idRutaActivo?: number;
  codigoRutaActivo = 'R-01';

  usuario: any;
  nombre = '';
  rol = '';
  fecha = '';

  totalUsuarios = 0;
  totalAlumnos = 0;
  totalChoferes = 0;
  totalBuses = 0;
  totalReservas = 0;
  totalIncidencias = 0;
  viajesActivos = 0;
  busesOperativos = 0;
  busesEnRuta = 0;
  busesMantenimiento = 0;

  reservasPorDia: ReservaPorDia[] = [];
  actividadReciente: ActividadReciente[] = [];

  proximoViaje = '';
  estadoBus = '';
  misReservas = 0;
  misNotificaciones = 0;
  ruta = '';
  paradero = '';
  horaLlegadaBus = '';
  alumnoPerfil: Alumno | null = null;

  busAsignado = '';
  estadoViaje = '';
  pasajeros = 0;
  incidenciasHoy = 0;
  horaSalida = '';
  horaLlegada = '';
  asientosDisponibles = 0;
  viajesPendientesHoy = 0;
  viajesCompletadosHoy = 0;
  mensajeJornada = '';

  rutasMapa: RutaMapaView[] = [];
  rutaMapaActiva: RutaMapaView | null = null;
  cargandoMapas = false;
  etaInfo: EtaInfo | null = null;
  codigoQrInput = '';
  idParaderoReserva?: number;

  private indiceRuta = 0;
  private chartListo = false;
  // null = aún no cargado; undefined = viaje terminado
  private anteriorIdViaje: number | undefined | null = null;

  ngOnInit(): void {
    this.usuario = this.session.obtener();
    this.nombre = this.session.obtenerNombre();
    this.rol = this.session.obtenerRol();
    this.fecha = new Date().toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    switch (this.rol) {
      case 'ADMINISTRADOR':
        this.cargarDashboardAdmin();
        this.cargarMapasAdmin();
        this.pollDashboard = interval(30000).subscribe(() => this.cargarDashboardAdmin(false));
        break;
      case 'ALUMNO':
        this.cargarDashboardAlumno();
        this.cargarPerfilAlumno();
        this.pollDashboard = interval(15000).subscribe(() => this.cargarDashboardAlumno());
        break;
      case 'CHOFER':
        this.cargarDashboardChofer();
        this.pollDashboard = interval(15000).subscribe(() => this.cargarDashboardChofer());
        break;
    }

    this.iniciarWebSocket();
    if (this.esBrowser) {
      window.addEventListener('online', this.onlineHandler);
    }
  }

  ngAfterViewInit(): void {
    this.chartListo = true;
    if (this.rol === 'ADMINISTRADOR' && this.reservasPorDia.length) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    this.simulacion?.unsubscribe();
    this.seguimiento?.unsubscribe();
    this.pollUbicacion?.unsubscribe();
    this.pollDashboard?.unsubscribe();
    this.wsService.desconectar();
    this.chart?.destroy();
    if (this.esBrowser) {
      window.removeEventListener('online', this.onlineHandler);
    }
  }

  get alumnoSancionado(): boolean {
    return this.alumnoPerfil?.puedeReservar === false;
  }

  fechaSancionAlumno(): string {
    const f = this.alumnoPerfil?.bloqueadoReservasHasta;
    if (!f) return '—';
    const [y, m, d] = f.split('-');
    return `${d}/${m}/${y}`;
  }

  private cargarPerfilAlumno(): void {
    if (!this.usuario?.idUsuario) return;
    this.alumnoService.buscarPorUsuario(this.usuario.idUsuario).subscribe({
      next: (alumno) => {
        this.alumnoPerfil = alumno;
        this.cdr.detectChanges();
      }
    });
  }

  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  get choferSinViajesPendientes(): boolean {
    return this.estadoViaje === 'SIN VIAJE'
      || this.estadoViaje === 'JORNADA_COMPLETA'
      || (this.viajesPendientesHoy === 0 && this.viajesCompletadosHoy > 0);
  }

  textoEstadoMapa(): string {
    if (this.viajeIniciado) return 'Bus en ruta · vivo';
    if (this.rol === 'ADMINISTRADOR') {
      return `${this.rutasMapa.length} ruta(s) monitoreada(s)`;
    }
    if (this.rutaMapaActiva) return `${this.rutaMapaActiva.codigo} · ${this.rutaMapaActiva.nombre}`;
    return 'Esperando datos de ruta';
  }

  iniciarViaje(): void {
    if (this.viajeIniciado || !this.rutaMapaActiva?.mapeable) return;

    this.viajeIniciado = true;
    this.estadoViaje = 'EN_CURSO';

    if (this.idViajeActivo) {
      this.viajeService.actualizarEstado(this.idViajeActivo, 'EN_CURSO').subscribe({
        error: () => undefined
      });
    }

    this.iniciarSimulacion();
  }

  finalizarViaje(): void {
    if (!this.idViajeActivo) return;
    const puedeFinalizar = this.viajeIniciado
      || this.estadoViaje === 'EN_CURSO'
      || this.estadoViaje === 'EN_RUTA'
      || this.estadoViaje === 'PROGRAMADO';
    if (!puedeFinalizar) return;

    this.simulacion?.unsubscribe();
    this.viajeService.actualizarEstado(this.idViajeActivo, 'FINALIZADO').subscribe({
      next: () => this.onViajeFinalizado(),
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo finalizar',
          text: err.error?.message ?? 'El viaje sigue activo en el servidor. Intenta de nuevo.'
        });
        this.cargarDashboardChofer();
      }
    });
  }

  confirmarCierreViaje(): void {
    if (!this.idViajeActivo || this.choferSinViajesPendientes) return;

    Swal.fire({
      icon: 'question',
      title: '¿Cerrar viaje del día?',
      text: 'Confirma solo si ya completaste el recorrido. El viaje pasará a finalizado.',
      showCancelButton: true,
      confirmButtonText: 'Sí, ya terminé',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    }).then((result) => {
      if (result.isConfirmed) {
        this.finalizarViaje();
      }
    });
  }

  private onViajeFinalizado(): void {
    this.viajeIniciado = false;
    this.simulacion?.unsubscribe();

    if (this.codigoRutaActivo) {
      this.reiniciarMapaViaje(this.codigoRutaActivo);
    }

    this.cargarDashboardChofer(true);
  }

  private esJornadaCompleta(data: DashboardChofer): boolean {
    return !data.idViaje
      || data.estadoViaje === 'SIN VIAJE'
      || data.estadoViaje === 'JORNADA_COMPLETA'
      || ((data.viajesPendientesHoy ?? 0) === 0 && (data.viajesCompletadosHoy ?? 0) > 0);
  }

  private cargarMapasAdmin(): void {
    this.cargandoMapas = true;
    this.rutaMapaService.listarMapeables().subscribe({
      next: (mapas) => {
        this.rutasMapa = mapas;
        this.cargandoMapas = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoMapas = false;
        this.cdr.detectChanges();
      }
    });
  }

  private cargarMapaRol(idRuta: number | undefined, codigo?: string): void {
    if (!idRuta) return;
    this.cargandoMapas = true;
    this.rutaMapaService.cargarMapa(idRuta).subscribe({
      next: (mapa) => {
        this.rutaMapaActiva = mapa;
        this.codigoRutaActivo = mapa.codigo || codigo || 'R-01';
        this.idRutaActivo = mapa.idRuta;
        if (mapa.mapeable && mapa.marcadores.length) {
          const inicio = mapa.marcadores[0];
          this.trackingBus.registrarInicioRuta(this.codigoRutaActivo, inicio.lat, inicio.lng);
          if (!this.viajeIniciado) {
            this.trackingBus.saltarA(
              this.codigoRutaActivo,
              inicio.lat,
              inicio.lng,
              false,
              this.idViajeActivo,
              0
            );
          }
        }
        this.suscribirRutaActiva();
        this.cargandoMapas = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoMapas = false;
        this.cdr.detectChanges();
      }
    });
  }

  private suscribirRutaActiva(): void {
    this.seguimiento?.unsubscribe();
    if (!this.codigoRutaActivo) return;
    this.seguimiento = this.trackingBus.posicionRuta$(this.codigoRutaActivo).subscribe((posicion) => {
      this.ultimaActualizacion = posicion.actualizadoEn;
      if (this.rol !== 'CHOFER') {
        this.viajeIniciado = posicion.activo;
      }
      this.cdr.detectChanges();
    });
  }

  private iniciarWebSocket(): void {
    if (this.rol === 'CHOFER') {
      return;
    }
    this.wsService.conectar();
    this.wsService.escucharUbicaciones().subscribe((u) => {
      if (!u.codigoRuta) return;
      this.trackingBus.publicarRuta(
        u.codigoRuta,
        Number(u.latitud),
        Number(u.longitud),
        true,
        u.idViaje
      );
      if (this.rol === 'ALUMNO' && this.idViajeActivo === u.idViaje) {
        this.actualizarEta();
      }
      this.cdr.detectChanges();
    });
    this.wsService.alConectar().subscribe(() => this.sincronizarUbicacionApi());
    this.pollUbicacion = interval(3000).subscribe(() => this.sincronizarUbicacionApi());
    this.sincronizarUbicacionApi();
  }

  validarQrEmbarque(): void {
    if (!this.codigoQrInput.trim() || !this.idViajeActivo) return;
    this.reservaService.validarQr(this.codigoQrInput.trim(), this.idViajeActivo).subscribe({
      next: (r) => {
        Swal.fire({ icon: r.valido ? 'success' : 'warning', title: r.valido ? 'Embarque OK' : 'QR inválido', text: r.mensaje });
        if (r.valido) {
          this.codigoQrInput = '';
          this.pasajeros += 1;
          this.cdr.detectChanges();
        }
      }
    });
  }

  private actualizarEta(): void {
    if (!this.idViajeActivo || !this.idParaderoReserva) return;
    this.etaService.calcular(this.idViajeActivo, this.idParaderoReserva).subscribe({
      next: (eta) => { this.etaInfo = eta; this.cdr.detectChanges(); },
      error: () => undefined
    });
  }

  cargarDashboardAdmin(render = true): void {
    this.dashboardService.dashboardAdmin().subscribe({
      next: (data) => {
        this.totalUsuarios = data.totalUsuarios;
        this.totalAlumnos = data.totalAlumnos;
        this.totalChoferes = data.totalChoferes;
        this.totalBuses = data.totalBuses;
        this.totalReservas = data.totalReservas;
        this.totalIncidencias = data.incidenciasPendientes;
        this.viajesActivos = data.viajesActivos;
        this.busesOperativos = data.busesOperativos ?? data.totalBuses;
        this.busesEnRuta = data.viajesActivos;
        this.busesMantenimiento = data.busesMantenimiento ?? 0;
        this.reservasPorDia = data.reservasPorDia ?? [];
        this.actividadReciente = data.actividadReciente ?? [];
        this.cdr.detectChanges();
        if (render && this.chartListo) this.renderChart();
      },
      error: (error) => console.error('Error cargando Dashboard Administrador', error)
    });
  }

  cargarDashboardAlumno(): void {
    if (!this.usuario?.idUsuario) return;
    this.dashboardService.dashboardAlumno(this.usuario.idUsuario).subscribe({
      next: (data) => {
        const nuevoIdViaje = data.idViaje;
        const nuevoCodigoRuta = data.codigoRuta || 'R-01';
        const viajeChanged = this.anteriorIdViaje !== null && nuevoIdViaje !== this.anteriorIdViaje;

        if (viajeChanged) {
          // Viaje terminó o cambió → resetear posición del bus al inicio
          this.resetearTracking(this.codigoRutaActivo || nuevoCodigoRuta);
        }

        this.proximoViaje = data.proximoViaje;
        this.estadoBus = data.estadoBus;
        this.misReservas = data.misReservas;
        this.misNotificaciones = data.notificaciones;
        this.ruta = data.ruta;
        this.paradero = data.paradero;
        this.horaLlegadaBus = data.horaLlegadaBus;
        this.idViajeActivo = nuevoIdViaje;
        this.idRutaActivo = data.idRuta;
        this.codigoRutaActivo = nuevoCodigoRuta;
        const esPrimeraCarga = this.anteriorIdViaje === null;
        this.anteriorIdViaje = nuevoIdViaje;

        // En primera carga o cambio de viaje: resetear tracking y recargar mapa
        if (esPrimeraCarga || viajeChanged) {
          if (nuevoCodigoRuta) {
            this.trackingBus.resetear(nuevoCodigoRuta);
          }
          this.cargarMapaRol(data.idRuta, nuevoCodigoRuta);
        }

        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error cargando Dashboard Alumno', error)
    });
  }

  private resetearTracking(codigoRuta: string): void {
    if (!codigoRuta) return;
    this.trackingBus.resetear(codigoRuta);
  }

  cargarDashboardChofer(mostrarAlerta = false): void {
    if (!this.usuario?.idUsuario) return;
    this.dashboardService.dashboardChofer(this.usuario.idUsuario).subscribe({
      next: (data) => {
        const nuevoIdViaje = data.idViaje;
        const codigoAnterior = this.codigoRutaActivo;
        const esPrimeraCargaChofer = this.anteriorIdViaje === null;
        const viajeChanged = !esPrimeraCargaChofer && nuevoIdViaje !== this.anteriorIdViaje;

        this.busAsignado = data.busAsignado;
        this.estadoViaje = data.estadoViaje;
        this.pasajeros = data.pasajeros;
        this.incidenciasHoy = data.incidenciasHoy;
        this.horaSalida = data.horaSalida;
        this.horaLlegada = data.horaLlegada;
        this.asientosDisponibles = data.asientosDisponibles;
        this.idViajeActivo = nuevoIdViaje;
        this.idRutaActivo = data.idRuta;
        this.codigoRutaActivo = data.codigoRuta || 'R-01';
        this.ruta = data.ruta;
        this.viajesPendientesHoy = data.viajesPendientesHoy ?? 0;
        this.viajesCompletadosHoy = data.viajesCompletadosHoy ?? 0;
        this.mensajeJornada = data.mensajeJornada ?? '';
        const jornadaCompleta = this.esJornadaCompleta(data);
        this.viajeIniciado = !jornadaCompleta
          && (data.estadoViaje === 'EN_CURSO' || data.estadoViaje === 'EN_RUTA');

        this.anteriorIdViaje = nuevoIdViaje;

        if (jornadaCompleta) {
          this.simulacion?.unsubscribe();
          if (codigoAnterior) {
            this.reiniciarMapaViaje(codigoAnterior);
          }
          this.rutaMapaActiva = null;
          this.idViajeActivo = undefined;
          this.codigoRutaActivo = '';
        } else if (esPrimeraCargaChofer || viajeChanged) {
          // Resetear tracking: viaje nuevo o primera carga con viaje no iniciado
          if (viajeChanged && codigoAnterior) {
            this.trackingBus.resetear(codigoAnterior);
          }
          // En primera carga, resetear el código de la nueva ruta para borrar posición vieja
          if (this.codigoRutaActivo) {
            this.trackingBus.resetear(this.codigoRutaActivo);
          }
          this.cargarMapaRol(data.idRuta, data.codigoRuta);
        }
        this.cdr.detectChanges();

        if (mostrarAlerta) {
          Swal.fire({
            icon: 'success',
            title: jornadaCompleta ? 'Jornada completada' : 'Viaje finalizado',
            text: this.mensajeJornada || 'El recorrido se completó correctamente.',
            timer: 2600,
            showConfirmButton: false
          });
        }
      },
      error: (error) => console.error('Error cargando Dashboard Chofer', error)
    });
  }

  claseEstado(estado: string): string {
    const e = (estado || '').toUpperCase();
    if (e.includes('PEND') || e.includes('ATEN') || e.includes('CANCEL')) return 'danger';
    if (e.includes('CURSO') || e.includes('RUTA') || e.includes('CONFIRM')) return 'info';
    return 'ok';
  }

  private renderChart(): void {
    if (!this.chartCanvas?.nativeElement) return;

    const labels = this.reservasPorDia.map((r) => r.fecha);
    const values = this.reservasPorDia.map((r) => r.total);

    this.chart?.destroy();

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Reservas',
            data: values,
            borderColor: '#dc2626',
            backgroundColor: 'rgba(220, 38, 38, 0.15)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#dc2626'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148,163,184,0.15)' }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#94a3b8', precision: 0 },
            grid: { color: 'rgba(148,163,184,0.15)' }
          }
        }
      }
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }

  private sincronizarUbicacionApi(): void {
    this.ubicacionService.listarActivas().subscribe({
      next: (lista) => {
        const codigosActivos = new Set(lista.map(u => u.codigoRuta).filter(Boolean));

        for (const u of lista) {
          const codigo = u.codigoRuta;
          if (!codigo) continue;
          this.trackingBus.publicarRuta(
            codigo,
            Number(u.latitud),
            Number(u.longitud),
            true,
            u.idViaje
          );
        }

        // Si la ruta del alumno ya no tiene bus activo → marcar como inactivo
        if (this.rol === 'ALUMNO' && this.codigoRutaActivo && !codigosActivos.has(this.codigoRutaActivo)) {
          const pos = this.trackingBus.obtenerActualRuta(this.codigoRutaActivo);
          if (pos.activo) {
            this.trackingBus.finalizar(this.codigoRutaActivo);
          }
        }

        this.cdr.detectChanges();
      },
      error: () => undefined
    });
  }

  private iniciarSimulacion(): void {
    if (!this.rutaMapaActiva?.mapeable) return;

    this.simulacion?.unsubscribe();
    this.indiceRuta = 0;

    const marcadores = this.pasosSimulacion(this.rutaMapaActiva);
    if (marcadores.length < 2) return;

    const codigo = this.codigoRutaActivo;
    const inicio = marcadores[0];

    this.trackingBus.publicarRuta(codigo, inicio.lat, inicio.lng, true, this.idViajeActivo, 0);
    this.publicarUbicacionApi(inicio.lat, inicio.lng);

    this.simulacion = interval(3200).subscribe(() => {
      this.indiceRuta++;

      if (this.indiceRuta >= marcadores.length) {
        const destino = marcadores[marcadores.length - 1];
        this.trackingBus.publicarRuta(
          codigo,
          destino.lat, destino.lng, false,
          this.idViajeActivo, marcadores.length - 1
        );
        this.publicarUbicacionApi(destino.lat, destino.lng);
        this.simulacion?.unsubscribe();
        if (this.idViajeActivo) {
          this.viajeService.actualizarEstado(this.idViajeActivo, 'FINALIZADO').subscribe({
            next: () => this.onViajeFinalizado(),
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'No se pudo finalizar',
                text: err.error?.message ?? 'El viaje sigue activo en el servidor.'
              });
              this.cargarDashboardChofer();
            }
          });
        } else {
          this.viajeIniciado = false;
          this.cdr.detectChanges();
        }
        return;
      }

      const punto = marcadores[this.indiceRuta];
      this.trackingBus.publicarRuta(
        codigo,
        punto.lat, punto.lng, true,
        this.idViajeActivo, this.indiceRuta
      );
      this.publicarUbicacionApi(punto.lat, punto.lng);
    });
  }

  /** Usa marcadores para simulación; si hay polilínea densa, avanza por segmentos equidistantes. */
  private pasosSimulacion(mapa: RutaMapaView): PuntoRuta[] {
    if (mapa.marcadores.length >= 2) {
      return mapa.marcadores;
    }
    return mapa.puntos.filter((p) => p.tipo !== 'trayecto').length >= 2
      ? mapa.puntos.filter((p) => p.tipo !== 'trayecto')
      : mapa.puntos;
  }

  private publicarUbicacionApi(lat: number, lng: number): void {
    if (!this.idViajeActivo) return;
    this.offlineGps.publicar(this.idViajeActivo, lat, lng, 28);
  }

  private reiniciarMapaViaje(codigo?: string): void {
    const c = codigo || this.codigoRutaActivo;
    if (!c) return;
    this.trackingBus.resetear(c);
  }
}
