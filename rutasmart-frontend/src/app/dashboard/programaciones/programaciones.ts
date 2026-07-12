import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramacionViajeService } from '../../service/programacion-viaje';
import { AsignacionProgramacionService } from '../../service/asignacion-programacion';
import { RutaService } from '../../service/ruta';
import { BusService } from '../../service/bus';
import { ChoferService } from '../../service/chofer';
import { ProgramacionViaje } from '../../models/programacion-viaje';
import { AsignacionProgramacion } from '../../models/asignacion-programacion';
import { Ruta } from '../../models/ruta';
import { Bus } from '../../models/bus';
import { ChoferResponse } from '../../models/chofer';
import Swal from 'sweetalert2';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

@Component({
  selector: 'app-programaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './programaciones.html',
  styleUrls: ['./programaciones.css']
})
export class ProgramacionesComponent implements OnInit {

  private programacionService = inject(ProgramacionViajeService);
  private asignacionService = inject(AsignacionProgramacionService);
  private rutaService = inject(RutaService);
  private busService = inject(BusService);
  private choferService = inject(ChoferService);

  dias = DIAS;

  rutas: Ruta[] = [];
  buses: Bus[] = [];
  choferes: ChoferResponse[] = [];

  programacionesLista: ProgramacionViaje[] = [];
  asignaciones: AsignacionProgramacion[] = [];
  cargando = false;

  mostrarModal = false;
  programacionEnEdicion: ProgramacionViaje | null = null;
  form: Partial<ProgramacionViaje> = {};
  diasSeleccionados: Record<string, boolean> = {};

  mostrarModalAsignacion = false;
  programacionParaAsignar: ProgramacionViaje | null = null;
  formAsignacion: Partial<AsignacionProgramacion> = {};

  ngOnInit(): void {
    this.rutaService.listar().subscribe({ next: (data) => this.rutas = data });
    this.busService.listar().subscribe({ next: (data) => this.buses = data });
    this.choferService.listar().subscribe({ next: (respuesta) => this.choferes = respuesta.data });
    this.listarProgramaciones();
    this.listarAsignaciones();
  }

  listarProgramaciones(): void {
    this.cargando = true;
    this.programacionService.listar().subscribe({
      next: (data) => {
        this.programacionesLista = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
      }
    });
  }

  listarAsignaciones(): void {
    this.asignacionService.listar().subscribe({
      next: (data) => this.asignaciones = data,
      error: (err) => console.error(err)
    });
  }

  nombreRuta(idRuta: number): string {
    return this.rutas.find(r => r.idRuta === idRuta)?.nombre ?? '-';
  }

  asignacionesDe(idProgramacion: number): AsignacionProgramacion[] {
    return this.asignaciones.filter(a => a.idProgramacion === idProgramacion);
  }

  nombreBus(idBus: number): string {
    return this.buses.find(b => b.idBus === idBus)?.codigo ?? '-';
  }

  nombreChofer(idChofer: number): string {
    const chofer = this.choferes.find(c => c.idChofer === idChofer);
    return chofer ? `${chofer.nombres} ${chofer.apellidos}` : '-';
  }

  abrirModalCrear(): void {
    this.programacionEnEdicion = null;
    this.diasSeleccionados = {};
    this.form = {
      idRuta: this.rutas[0]?.idRuta,
      horaSalida: '',
      horaLlegadaEstimada: '',
      estado: true
    };
    this.mostrarModal = true;
  }

  editarProgramacion(programacion: ProgramacionViaje): void {
    this.programacionEnEdicion = programacion;
    this.form = { ...programacion };
    this.diasSeleccionados = {};
    (programacion.diasOperacion ?? '').split(',').forEach(d => {
      if (d) this.diasSeleccionados[d] = true;
    });
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.programacionEnEdicion = null;
    this.form = {};
    this.diasSeleccionados = {};
  }

  guardarProgramacion(): void {

    this.form.diasOperacion = this.dias.filter(d => this.diasSeleccionados[d]).join(',');

    if (this.programacionEnEdicion?.idProgramacion) {

      this.programacionService.actualizar(this.programacionEnEdicion.idProgramacion, this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarProgramaciones();
          Swal.fire({
            icon: 'success',
            title: 'Programación actualizada',
            text: 'Se actualizó correctamente.',
            timer: 1800,
            showConfirmButton: false
          });
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'Error', text: error.error?.message });
        }
      });

    } else {

      this.programacionService.guardar(this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarProgramaciones();
          Swal.fire({
            icon: 'success',
            title: 'Programación registrada',
            text: 'Registro exitoso.',
            timer: 1800,
            showConfirmButton: false
          });
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'Error', text: error.error?.message });
        }
      });

    }

  }

  eliminarProgramacion(id: number): void {

    Swal.fire({
      title: '¿Eliminar programación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.programacionService.eliminar(id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Programación eliminada', timer: 1500, showConfirmButton: false });
          this.listarProgramaciones();
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: error.error?.message ?? 'Ocurrió un error.' });
        }
      });

    });

  }

  abrirModalAsignar(programacion: ProgramacionViaje): void {
    this.programacionParaAsignar = programacion;
    this.formAsignacion = {
      idProgramacion: programacion.idProgramacion,
      idBus: this.buses[0]?.idBus,
      idChofer: this.choferes[0]?.idChofer,
      fechaInicio: '',
      fechaFin: '',
      estado: true
    };
    this.mostrarModalAsignacion = true;
  }

  cerrarModalAsignacion(): void {
    this.mostrarModalAsignacion = false;
    this.programacionParaAsignar = null;
    this.formAsignacion = {};
  }

  guardarAsignacion(): void {

    this.asignacionService.guardar(this.formAsignacion).subscribe({
      next: () => {
        this.cerrarModalAsignacion();
        this.listarAsignaciones();
        Swal.fire({
          icon: 'success',
          title: 'Asignación registrada',
          text: 'Bus y chofer asignados correctamente.',
          timer: 1800,
          showConfirmButton: false
        });
      },
      error: (error) => {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error?.message });
      }
    });

  }

  eliminarAsignacion(id: number): void {

    Swal.fire({
      title: '¿Eliminar asignación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.asignacionService.eliminar(id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Asignación eliminada', timer: 1500, showConfirmButton: false });
          this.listarAsignaciones();
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: error.error?.message ?? 'Ocurrió un error.' });
        }
      });

    });

  }

}
