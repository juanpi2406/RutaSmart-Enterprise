import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IncidenciaService } from '../../service/incidencia';
import { ViajeService } from '../../service/viaje';
import { ChoferService } from '../../service/chofer';
import { AlumnoService } from '../../service/alumno';
import { ReservaService } from '../../service/reserva';
import { SessionService } from '../../service/session';
import { Incidencia } from '../../models/incidencia';
import { Viaje } from '../../models/viaje';
import Swal from 'sweetalert2';

const TIPOS = ['MECANICA', 'ACCIDENTE', 'RETRASO', 'OTRO'];
const ESTADOS = ['PENDIENTE', 'EN_REVISION', 'RESUELTA'];

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incidencias.html',
  styleUrls: ['../alumno-shared.css', './incidencias.css']
})
export class IncidenciasComponent implements OnInit {

  private incidenciaService = inject(IncidenciaService);
  private viajeService = inject(ViajeService);
  private choferService = inject(ChoferService);
  private alumnoService = inject(AlumnoService);
  private reservaService = inject(ReservaService);
  private session = inject(SessionService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  tipos = TIPOS;
  estados = ESTADOS;

  esAdmin = false;
  esAlumno = false;
  esChofer = false;
  idUsuario = 0;
  idViajePreferido?: number;

  viajes: Viaje[] = [];
  incidenciasLista: Incidencia[] = [];
  incidenciasFiltradas: Incidencia[] = [];
  cargando = false;

  mostrarModal = false;
  incidenciaEnEdicion: Incidencia | null = null;
  form: Partial<Incidencia> = {};
  guardando = false;
  errorModal = '';

  ngOnInit(): void {
    const usuario = this.session.obtener();
    this.idUsuario = usuario?.idUsuario ?? 0;
    const rol = this.session.obtenerRol();
    this.esAdmin = rol === 'ADMINISTRADOR';
    this.esAlumno = rol === 'ALUMNO';
    this.esChofer = rol === 'CHOFER';

    this.cargarViajes();
    this.listarIncidencias();

    const abrirModal =
      this.router.url.includes('reportar-incidencia') ||
      this.router.url.includes('modal=1');

    if (abrirModal) {
      setTimeout(() => this.abrirModalReportar(), 0);
    }
  }

  get totalIncidencias(): number {
    return this.incidenciasLista.length;
  }

  get pendientes(): number {
    return this.incidenciasLista.filter(i =>
      i.estado === 'PENDIENTE' || i.estado === 'REPORTADA' || i.estado === 'EN_REVISION'
    ).length;
  }

  get resueltas(): number {
    return this.incidenciasLista.filter(i => i.estado === 'RESUELTA').length;
  }

  tituloPagina(): string {
    if (this.esAdmin) return 'Gestión de Incidencias';
    if (this.esAlumno) return 'Mis Incidencias';
    return 'Reportar Incidencia';
  }

  subtituloPagina(): string {
    if (this.esAdmin) return 'Administración de incidencias reportadas en el sistema.';
    if (this.esAlumno) return 'Reporta problemas en tu viaje y consulta el estado de tus reportes.';
    return 'Reporta incidencias durante tus viajes y consulta tu historial.';
  }

  private cargarViajes(): void {
    if (this.esAdmin) {
      this.viajeService.listar().subscribe({
        next: (data) => {
          this.viajes = data;
          this.cdr.markForCheck();
        }
      });
      return;
    }

    if (this.esAlumno) {
      this.alumnoService.buscarPorUsuario(this.idUsuario).subscribe({
        next: (alumno) => {
          this.reservaService.listarPorAlumno(alumno.idAlumno).subscribe({
            next: (reservas) => {
              const activas = reservas.filter(r => r.estado === 'RESERVADO' || r.estado === 'ABORDADO');
              const ids = [...new Set(activas.map(r => r.idViaje))];
              this.viajes = ids.map(id => ({
                idViaje: id,
                fechaViaje: activas.find(r => r.idViaje === id)?.fechaAbordaje?.substring(0, 10) ?? ''
              } as Viaje));
              this.idViajePreferido = this.viajes[0]?.idViaje;
              this.cdr.markForCheck();
            },
            error: () => this.cdr.markForCheck()
          });
        },
        error: () => undefined
      });
      return;
    }

    this.choferService.obtenerPorUsuario(this.idUsuario).subscribe({
      next: (resp) => {
        this.viajeService.listarPorChofer(resp.data.idChofer).subscribe({
          next: (data) => {
            this.viajes = data;
            const activo = data.find(v => v.estado === 'EN_CURSO' || v.estado === 'EN_RUTA');
            this.idViajePreferido = activo?.idViaje ?? data[0]?.idViaje;
            this.cdr.markForCheck();
          }
        });
      },
      error: () => undefined
    });
  }

  listarIncidencias(): void {
    this.cargando = true;
    const peticion = this.esAdmin
      ? this.incidenciaService.listar()
      : this.incidenciaService.listarPorUsuario(this.idUsuario);

    peticion.subscribe({
      next: (data) => {
        this.incidenciasLista = data;
        this.incidenciasFiltradas = [...data];
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.incidenciasLista = [];
        this.incidenciasFiltradas = [];
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  abrirModalReportar(): void {
    const sesion = this.session.obtener();
    this.idUsuario = sesion?.idUsuario ?? this.idUsuario;
    this.incidenciaEnEdicion = null;
    this.errorModal = '';
    this.guardando = false;
    this.form = {
      idUsuario: this.idUsuario,
      idViaje: this.idViajePreferido ?? this.viajes[0]?.idViaje,
      tipo: this.tipos[0],
      descripcion: '',
      estado: 'PENDIENTE'
    };
    this.mostrarModal = true;
    this.cdr.markForCheck();
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
    if (this.guardando) return;
    this.mostrarModal = false;
    this.incidenciaEnEdicion = null;
    this.form = {};
    this.errorModal = '';
    this.cdr.markForCheck();
  }

  reportarIncidencia(): void {
    if (this.guardando) return;

    if (!this.form.descripcion?.trim()) {
      this.errorModal = 'Describe la incidencia.';
      this.cdr.markForCheck();
      return;
    }

    const sesion = this.session.obtener();
    const idUsuario = sesion?.idUsuario ?? this.idUsuario;
    if (!idUsuario) {
      this.errorModal = 'Sesión inválida. Vuelve a iniciar sesión.';
      this.cdr.markForCheck();
      return;
    }

    this.guardando = true;
    this.errorModal = '';
    this.cdr.markForCheck();

    const idViaje = Number(this.form.idViaje);
    const payload: Partial<Incidencia> = {
      idUsuario,
      tipo: this.form.tipo ?? this.tipos[0],
      descripcion: this.form.descripcion.trim(),
      estado: 'PENDIENTE'
    };
    if (Number.isFinite(idViaje) && idViaje > 0) {
      payload.idViaje = idViaje;
    }

    const enviar = (lat?: number, lng?: number) => {
      if (lat != null && lng != null) {
        payload.latitud = lat;
        payload.longitud = lng;
      }
      this.incidenciaService.guardar(payload).subscribe({
        next: () => {
          this.guardando = false;
          this.mostrarModal = false;
          this.form = {};
          this.listarIncidencias();
          this.cdr.detectChanges();
          Swal.fire({
            icon: 'success',
            title: 'Incidencia reportada',
            text: 'Se registró correctamente.',
            timer: 1800,
            showConfirmButton: false
          });
        },
        error: (error) => {
          this.guardando = false;
          this.errorModal = error.error?.message ?? 'No se pudo registrar la incidencia.';
          this.cdr.markForCheck();
          Swal.fire({ icon: 'error', title: 'Error al reportar', text: this.errorModal });
        }
      });
    };

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => enviar(pos.coords.latitude, pos.coords.longitude),
        () => enviar()
      );
    } else {
      enviar();
    }
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
