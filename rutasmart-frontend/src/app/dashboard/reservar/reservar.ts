import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViajeService } from '../../service/viaje';
import { RutaService } from '../../service/ruta';
import { ParaderoService } from '../../service/paradero';
import { ReservaService } from '../../service/reserva';
import { BusService } from '../../service/bus';
import { AsientoService } from '../../service/asiento';
import { AlumnoService } from '../../service/alumno';
import { SessionService } from '../../service/session';
import { Viaje } from '../../models/viaje';
import { Ruta } from '../../models/ruta';
import { Paradero } from '../../models/paradero';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservar.html'
})
export class ReservarComponent implements OnInit {
  private viajeService = inject(ViajeService);
  private rutaService = inject(RutaService);
  private paraderoService = inject(ParaderoService);
  private reservaService = inject(ReservaService);
  private busService = inject(BusService);
  private asientoService = inject(AsientoService);
  private alumnoService = inject(AlumnoService);
  private session = inject(SessionService);

  rutas: Ruta[] = [];
  viajesDisponibles: Viaje[] = [];
  paraderos: Paradero[] = [];
  mostrarModal = false;
  busco = false;
  cargandoBus = false;
  asientos: { numeroAsiento: number; estado: boolean }[] = [];

  idRutaSeleccionada = 0;
  fechaViaje = '';
  capacidad = 0;
  reservasOcupadas = 0;

  viajeSeleccionado: Viaje | null = null;
  form: Partial<Reserva> = {};

  ngOnInit(): void {
    this.cargarRutas();
  }

  cargarRutas(): void {
    this.rutaService.listar().subscribe({
      next: (data) => this.rutas = data,
      error: (err) => console.error(err)
    });
  }

  puedeBuscar(): boolean {
    return this.idRutaSeleccionada > 0 && this.fechaViaje !== '';
  }

  buscarViajes(): void {
    if (!this.puedeBuscar()) return;
    this.busco = true;

    this.viajeService.listarPorRutaYFecha(this.idRutaSeleccionada, this.fechaViaje).subscribe({
      next: (data) => {
        this.viajesDisponibles = data.filter(v => v.estado !== 'CANCELADA');
      },
      error: (err) => console.error(err)
    });
  }

  seleccionarViaje(viaje: Viaje): void {
    this.viajeSeleccionado = viaje;
    this.cargarParaderos();
    this.cargarDisponibilidad(viaje);
    this.cargarCapacidadBus(viaje);
    this.cargarAsientos(viaje);
    this.form = {
      idViaje: viaje.idViaje,
      estado: 'PENDIENTE'
    };
    this.mostrarModal = true;
  }

  cargarParaderos(): void {
    if (this.idRutaSeleccionada > 0) {
      this.paraderoService.listarPorRuta(this.idRutaSeleccionada).subscribe({
        next: (data) => this.paraderos = data,
        error: (err) => console.error(err)
      });
    }
  }

  cargarDisponibilidad(viaje: Viaje): void {
    this.reservaService.listarPorViaje(viaje.idViaje).subscribe({
      next: (data) => {
        this.reservasOcupadas = data.filter(r => r.estado !== 'CANCELADA').length;
      },
      error: (err) => console.error(err)
    });
  }

  cargarCapacidadBus(viaje: Viaje): void {
    this.cargandoBus = true;
    this.busService.buscarPorId(viaje.idBus).subscribe({
      next: (bus) => {
        this.capacidad = bus.capacidadAsientos;
        this.cargandoBus = false;
      },
      error: (err) => {
        console.error(err);
        this.capacidad = 0;
        this.cargandoBus = false;
      }
    });
  }

  cargarAsientos(viaje: Viaje): void {
    this.asientoService.listarPorViaje(viaje.idViaje).subscribe({
      next: (data) => {
        this.asientos = data.map(a => ({ numeroAsiento: a.numeroAsiento, estado: a.estado }));
      },
      error: () => {
        this.asientos = [];
      }
    });
  }

  confirmarReserva(event: Event): void {
    event.preventDefault();
    if (!this.form.idParadero || !this.form.fechaAbordaje || !this.form.numeroAsiento) return;

    const usuario = this.session.obtener();
    if (!usuario) {
      alert('No hay sesión activa');
      return;
    }

    this.alumnoService.buscarPorUsuario(usuario.idUsuario).subscribe({
      next: (alumno) => {
        this.reservaService.guardar({
          idAlumno: alumno.idAlumno,
          idViaje: this.form.idViaje,
          idParadero: this.form.idParadero!,
          fechaAbordaje: this.form.fechaAbordaje,
          estado: 'PENDIENTE',
          numeroAsiento: this.form.numeroAsiento
        }).subscribe({
          next: () => {
            alert('Reserva creada correctamente');
            this.cerrarModal();
          },
          error: (err) => {
            console.error(err);
            const mensaje = err?.status ? `Error ${err.status}` : 'Error al crear reserva';
            alert(mensaje);
          }
        });
      },
      error: (err) => {
        console.error(err);
        alert('No se pudo resolver el alumno para la reserva');
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.viajeSeleccionado = null;
    this.form = {};
    this.paraderos = [];
    this.capacidad = 0;
    this.reservasOcupadas = 0;
    this.cargandoBus = false;
    this.asientos = [];
  }
}
