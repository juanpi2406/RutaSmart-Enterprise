import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ViajeService } from '../../service/viaje';
import { ReservaService } from '../../service/reserva';
import { BusService } from '../../service/bus';
import { AsientoService } from '../../service/asiento';
import { AlumnoService } from '../../service/alumno';
import { RutaService } from '../../service/ruta';
import { ParaderoService } from '../../service/paradero';
import { SessionService } from '../../service/session';
import { Viaje } from '../../models/viaje';
import { Ruta } from '../../models/ruta';
import { Paradero } from '../../models/paradero';
import { Reserva } from '../../models/reserva';
import { Alumno } from '../../models/alumno';

@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reservar.html',
  styleUrls: ['../alumno-shared.css', '../reservas/reservas.css', './reservar.css']
})
export class ReservarComponent implements OnInit {
  private viajeService = inject(ViajeService);
  private reservaService = inject(ReservaService);
  private busService = inject(BusService);
  private asientoService = inject(AsientoService);
  private alumnoService = inject(AlumnoService);
  private rutaService = inject(RutaService);
  private paraderoService = inject(ParaderoService);
  private session = inject(SessionService);
  private cdr = inject(ChangeDetectorRef);

  rutas: Ruta[] = [];
  viajesDisponibles: Viaje[] = [];
  paraderos: Paradero[] = [];
  alumnoPerfil: Alumno | null = null;
  mostrarModal = false;
  busco = false;
  cargando = false;
  cargandoRutas = true;
  guardando = false;
  cargandoBus = false;
  asientos: { numeroAsiento: number; estado: boolean }[] = [];
  confirmoAsistencia = false;

  idRutaSeleccionada = 0;
  fechaViaje = '';
  capacidad = 0;
  reservasOcupadas = 0;

  viajeSeleccionado: Viaje | null = null;
  form: Partial<Reserva> = {};

  ngOnInit(): void {
    this.fechaViaje = new Date().toISOString().substring(0, 10);
    this.cargarRutas();
  }

  get bloqueado(): boolean {
    return this.alumnoPerfil?.puedeReservar === false;
  }

  get fechaSancionFormateada(): string {
    return this.formatearFecha(this.alumnoPerfil?.bloqueadoReservasHasta);
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  private cargarRutas(): void {
    const sesion = this.session.obtener();
    this.rutaService.listar().subscribe({
      next: (data) => {
        this.rutas = data.filter(r => r.estado !== false);
        if (sesion?.idUsuario) {
          this.alumnoService.buscarPorUsuario(sesion.idUsuario).subscribe({
            next: (alumno) => {
              this.alumnoPerfil = alumno;
              this.finalizarCargaRutas();
            },
            error: () => this.finalizarCargaRutas()
          });
        } else {
          this.finalizarCargaRutas();
        }
      },
      error: () => {
        this.rutas = [];
        this.cargandoRutas = false;
        this.cdr.markForCheck();
      }
    });
  }

  private finalizarCargaRutas(): void {
    if (this.rutas.length === 1) {
      this.idRutaSeleccionada = this.rutas[0].idRuta;
    }
    this.cargandoRutas = false;
    this.cdr.markForCheck();
  }

  rutaActiva(): Ruta | undefined {
    return this.rutas.find(r => r.idRuta === this.idRutaSeleccionada);
  }

  seleccionarRuta(idRuta: number): void {
    if (this.bloqueado) return;
    this.idRutaSeleccionada = idRuta;
    if (this.puedeBuscar()) {
      this.buscarViajes();
    }
    this.cdr.markForCheck();
  }

  puedeBuscar(): boolean {
    return this.idRutaSeleccionada > 0 && this.fechaViaje !== '' && !this.bloqueado;
  }

  buscarViajes(): void {
    if (!this.puedeBuscar()) return;
    this.busco = true;
    this.cargando = true;
    this.viajesDisponibles = [];

    this.viajeService.listarPorRutaYFecha(this.idRutaSeleccionada, this.fechaViaje).subscribe({
      next: (data) => {
        this.viajesDisponibles = data.filter(v =>
          v.estado !== 'CANCELADA' && v.estado !== 'FINALIZADO' && v.estado !== 'COMPLETADO');
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.viajesDisponibles = [];
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  seleccionarViaje(viaje: Viaje): void {
    if (this.bloqueado) {
      Swal.fire({
        icon: 'warning',
        title: 'Reservas suspendidas',
        text: `Tienes ${this.alumnoPerfil?.inasistencias ?? 3} inasistencias. Podrás reservar después del ${this.formatearFecha(this.alumnoPerfil?.bloqueadoReservasHasta)}.`
      });
      return;
    }

    this.viajeSeleccionado = viaje;
    this.confirmoAsistencia = false;
    this.cargarParaderos();
    this.cargarDisponibilidad(viaje);
    this.cargarCapacidadBus(viaje);
    this.cargarAsientos(viaje);
    this.form = {
      idViaje: viaje.idViaje,
      estado: 'RESERVADO'
    };
    this.mostrarModal = true;
    this.cdr.markForCheck();
  }

  horarioViaje(viaje: Viaje): string {
    if (viaje.horaSalida) {
      return this.formatearHora(viaje.horaSalida);
    }
    return 'Por confirmar';
  }

  private formatearHora(hora: string): string {
    const partes = hora.split(':');
    if (partes.length < 2) return hora;
    const h24 = parseInt(partes[0], 10);
    const min = partes[1].substring(0, 2);
    const periodo = h24 >= 12 ? 'pm' : 'am';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:${min} ${periodo}`;
  }

  cargarParaderos(): void {
    this.paraderoService.listarPorRuta(this.idRutaSeleccionada).subscribe({
      next: (data) => {
        this.paraderos = data.sort((a, b) => a.orden - b.orden);
        this.cdr.markForCheck();
      },
      error: () => {
        this.paraderos = [];
        this.cdr.markForCheck();
      }
    });
  }

  cargarDisponibilidad(viaje: Viaje): void {
    this.reservaService.listarPorViaje(viaje.idViaje).subscribe({
      next: (data) => {
        this.reservasOcupadas = data.filter(r =>
          r.estado !== 'CANCELADO' && r.estado !== 'CANCELADA' && r.estado !== 'NO_ASISTIO').length;
        this.cdr.markForCheck();
      },
      error: () => {
        this.reservasOcupadas = 0;
        this.cdr.markForCheck();
      }
    });
  }

  cargarCapacidadBus(viaje: Viaje): void {
    this.cargandoBus = true;
    this.busService.buscarPorId(viaje.idBus).subscribe({
      next: (bus) => {
        this.capacidad = bus.capacidadAsientos;
        this.cargandoBus = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.capacidad = 0;
        this.cargandoBus = false;
        this.cdr.markForCheck();
      }
    });
  }

  cargarAsientos(viaje: Viaje): void {
    this.asientoService.listarPorViaje(viaje.idViaje).subscribe({
      next: (data) => {
        this.asientos = data.map(a => ({ numeroAsiento: a.numeroAsiento, estado: a.estado }));
        this.cdr.markForCheck();
      },
      error: () => {
        this.asientos = [];
        this.cdr.markForCheck();
      }
    });
  }

  seleccionarAsiento(numero: number, index: number): void {
    if (index < this.reservasOcupadas) return;
    this.form.numeroAsiento = numero;
    this.cdr.markForCheck();
  }

  asientosLibres(): number {
    return Math.max(0, this.capacidad - this.reservasOcupadas);
  }

  confirmarReserva(event: Event): void {
    event.preventDefault();
    if (this.guardando || this.bloqueado) return;
    if (!this.form.idParadero) return;
    if (!this.confirmoAsistencia) {
      Swal.fire({
        icon: 'warning',
        title: 'Confirma tu asistencia',
        text: 'Debes marcar que asistirás al viaje. Si reservas y no abordas, se registrará inasistencia (3 = sanción 7 días).'
      });
      return;
    }

    const usuario = this.session.obtener();
    if (!usuario?.idUsuario) {
      Swal.fire({ icon: 'warning', title: 'Sesión requerida', text: 'Vuelve a iniciar sesión.' });
      return;
    }

    this.guardando = true;
    this.cdr.markForCheck();

    this.alumnoService.buscarPorUsuario(usuario.idUsuario).subscribe({
      next: (alumno) => {
        const payload: Partial<Reserva> = {
          idAlumno: alumno.idAlumno,
          idViaje: this.form.idViaje,
          idParadero: this.form.idParadero!,
          estado: 'RESERVADO'
        };
        if (this.form.numeroAsiento) {
          payload.numeroAsiento = this.form.numeroAsiento;
        }
        this.reservaService.guardar(payload).subscribe({
          next: () => {
            this.guardando = false;
            this.cerrarModal();
            this.buscarViajes();
            Swal.fire({
              icon: 'success',
              title: 'Reserva confirmada',
              html: 'Tu asiento quedó registrado.<br>Presenta tu código QR al chofer al abordar.<br><small>3 inasistencias = suspensión 7 días.</small>',
              timer: 3200,
              showConfirmButton: false
            });
          },
          error: (err) => {
            this.guardando = false;
            this.cdr.markForCheck();
            Swal.fire({
              icon: 'error',
              title: 'No se pudo reservar',
              text: err?.error?.message ?? 'Inténtalo nuevamente.'
            });
          }
        });
      },
      error: () => {
        this.guardando = false;
        this.cdr.markForCheck();
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo identificar tu perfil de alumno.' });
      }
    });
  }

  cerrarModal(): void {
    if (this.guardando) return;
    this.mostrarModal = false;
    this.viajeSeleccionado = null;
    this.confirmoAsistencia = false;
    this.form = {};
    this.paraderos = [];
    this.capacidad = 0;
    this.reservasOcupadas = 0;
    this.cargandoBus = false;
    this.asientos = [];
    this.cdr.markForCheck();
  }
}
