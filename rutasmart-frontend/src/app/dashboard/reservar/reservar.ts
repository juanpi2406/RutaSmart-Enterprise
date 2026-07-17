import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViajeService } from '../../service/viaje';
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
  templateUrl: './reservar.html',
  styleUrls: ['./reservar.css']
})
export class ReservarComponent implements OnInit {
  private viajeService = inject(ViajeService);
  private reservaService = inject(ReservaService);
  private busService = inject(BusService);
  private asientoService = inject(AsientoService);
  private alumnoService = inject(AlumnoService);
  private session = inject(SessionService);

  rutas: Ruta[] = [
    {
      idRuta: 1,
      codigo: 'RUTA-A',
      nombre: 'Ruta A',
      origen: 'Universidad',
      destino: 'Mall del Sur',
      estado: true
    },
    {
      idRuta: 2,
      codigo: 'RUTA-B',
      nombre: 'Ruta B',
      origen: 'Universidad',
      destino: 'Polideportivo de V.E.S.',
      estado: true
    }
  ];
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

  ngOnInit(): void {}

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
      estado: 'RESERVADO',
      fechaAbordaje: this.fechaAbordajeViaje(viaje)
    };
    this.mostrarModal = true;
  }

  horarioViaje(idViaje: number): string {
    const totalMin = 20 * 60 + (idViaje - 41) * 30;
    const h24 = Math.floor(totalMin / 60) % 24;
    const minutos = totalMin % 60;
    const periodo = h24 >= 12 ? 'pm' : 'am';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:${minutos.toString().padStart(2, '0')}${periodo}`;
  }

  private fechaAbordajeViaje(viaje: Viaje): string {
    const totalMin = 20 * 60 + (viaje.idViaje - 41) * 30;
    const h24 = Math.floor(totalMin / 60) % 24;
    const minutos = totalMin % 60;
    const hh = h24.toString().padStart(2, '0');
    const mm = minutos.toString().padStart(2, '0');
    return `${this.fechaViaje}T${hh}:${mm}`;
  }

  cargarParaderos(): void {
    this.paraderos = [
      { idParadero: 1, idRuta: this.idRutaSeleccionada, nombre: 'Paradero 1: Puerta principal de la universidad', orden: 1, estado: true },
      { idParadero: 2, idRuta: this.idRutaSeleccionada, nombre: 'Paradero 2: Segunda puerta Mall del Sur', orden: 2, estado: true },
      { idParadero: 3, idRuta: this.idRutaSeleccionada, nombre: 'Paradero 3: Puerta principal Polideportivo de Villa El Salvador', orden: 3, estado: true }
    ];
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
    if (!this.form.idParadero || !this.form.fechaAbordaje) return;

    const usuario = this.session.obtener();
    if (!usuario) {
      alert('No hay sesión activa');
      return;
    }

    this.alumnoService.buscarPorUsuario(usuario.idUsuario).subscribe({
      next: (alumno) => {
        const payload: any = {
          idAlumno: alumno.idAlumno,
          idViaje: this.form.idViaje,
          idParadero: this.form.idParadero!,
          fechaAbordaje: this.form.fechaAbordaje,
          estado: 'RESERVADO'
        };
        if (this.form.numeroAsiento) {
          payload.numeroAsiento = this.form.numeroAsiento;
        }
        this.reservaService.guardar(payload).subscribe({
          next: () => {
            this.cerrarModal();
            alert('Reserva creada correctamente');
          },
          error: (err) => {
            console.error(err);
            alert(err?.error?.message ?? 'No se pudo registrar la reserva. Inténtalo nuevamente.');
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
