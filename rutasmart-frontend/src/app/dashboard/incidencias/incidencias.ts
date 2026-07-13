import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidenciaService } from '../../service/incidencia';
import { ViajeService } from '../../service/viaje';
import { SessionService } from '../../service/session';
import { Incidencia } from '../../models/incidencia';
import { Viaje } from '../../models/viaje';
import Swal from 'sweetalert2';

const TIPOS = ['MECANICA', 'ACCIDENTE', 'RETRASO', 'OTRO'];
const ESTADOS = ['REPORTADA', 'EN_REVISION', 'RESUELTA'];

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incidencias.html',
  styleUrls: ['./incidencias.css']
})
export class IncidenciasComponent implements OnInit {

  private incidenciaService = inject(IncidenciaService);
  private viajeService = inject(ViajeService);
  private session = inject(SessionService);
  private cdr = inject(ChangeDetectorRef);

  tipos = TIPOS;
  estados = ESTADOS;

  esAdmin = false;
  idUsuario = 0;

  viajes: Viaje[] = [];
  incidenciasLista: Incidencia[] = [];
  incidenciasFiltradas: Incidencia[] = [];
  cargando = false;

  mostrarModal = false;
  incidenciaEnEdicion: Incidencia | null = null;
  form: Partial<Incidencia> = {};

  ngOnInit(): void {
    const usuario = this.session.obtener();
    this.idUsuario = usuario?.idUsuario ?? 0;
    this.esAdmin = this.session.obtenerRol() === 'ADMINISTRADOR';

    this.viajeService.listar().subscribe({
      next: (data) => {
        this.viajes = data;
        this.cdr.detectChanges();
      }
    });
    this.listarIncidencias();
  }

  listarIncidencias(): void {
    this.cargando = true;
    this.incidenciaService.listar().subscribe({
      next: (data) => {
        this.incidenciasLista = this.esAdmin
          ? data
          : data.filter(i => i.idUsuario === this.idUsuario);
        this.incidenciasFiltradas = [...this.incidenciasLista];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalReportar(): void {
    this.incidenciaEnEdicion = null;
    this.form = {
      idUsuario: this.idUsuario,
      idViaje: this.viajes[0]?.idViaje,
      tipo: this.tipos[0],
      descripcion: '',
      estado: 'REPORTADA'
    };
    this.mostrarModal = true;
  }

  cambiarEstado(incidencia: Incidencia, nuevoEstado: string): void {

    this.incidenciaService.actualizar(incidencia.idIncidencia, { ...incidencia, estado: nuevoEstado }).subscribe({
      next: () => {
        this.listarIncidencias();
        Swal.fire({ icon: 'success', title: 'Estado actualizado', timer: 1500, showConfirmButton: false });
      },
      error: (error) => {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error?.message });
      }
    });

  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.incidenciaEnEdicion = null;
    this.form = {};
  }

  reportarIncidencia(): void {

    this.incidenciaService.guardar(this.form).subscribe({
      next: () => {
        this.cerrarModal();
        this.listarIncidencias();
        Swal.fire({
          icon: 'success',
          title: 'Incidencia reportada',
          text: 'Se registró correctamente.',
          timer: 1800,
          showConfirmButton: false
        });
      },
      error: (error) => {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error?.message });
      }
    });

  }

  eliminarIncidencia(id: number): void {

    Swal.fire({
      title: '¿Eliminar incidencia?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.incidenciaService.eliminar(id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Incidencia eliminada', timer: 1500, showConfirmButton: false });
          this.listarIncidencias();
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: error.error?.message ?? 'Ocurrió un error.' });
        }
      });

    });

  }

}
