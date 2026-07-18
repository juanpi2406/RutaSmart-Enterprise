import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { RutaService } from '../../service/ruta';
import { ParaderoService } from '../../service/paradero';
import { RutaMapaService } from '../../service/ruta-mapa.service';
import { Ruta } from '../../models/ruta';
import { PuntoEdicionRuta } from '../../models/punto-edicion-ruta';
import { PuntoRuta } from '../../config/ruta-javier-prado';
import { RouteEditorMapComponent } from '../../components/route-editor-map/route-editor-map.component';
import { RouteMapComponent } from '../../components/route-map/route-map.component';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouteEditorMapComponent, RouteMapComponent],
  templateUrl: './rutas.html',
  styleUrls: ['./rutas.css']
})
export class RutasComponent implements OnInit {

  private rutaService = inject(RutaService);
  private paraderoService = inject(ParaderoService);
  private rutaMapaService = inject(RutaMapaService);
  private cdr = inject(ChangeDetectorRef);

  rutasLista: Ruta[] = [];
  rutasFiltradas: Ruta[] = [];
  totalActivas = 0;
  totalSinGps = 0;

  filtroTexto = '';
  filtroEstado = 'TODOS';
  filtroGps = 'TODOS';
  cargando = false;
  guardando = false;

  mostrarModal = false;
  rutaEnEdicion: Ruta | null = null;
  form: Partial<Ruta> = {};

  /** Wizard solo para rutas nuevas: 1 datos, 2 mapa, 3 preview */
  pasoWizard = 1;
  puntosMapa: PuntoEdicionRuta[] = [];
  marcadoresPreview: PuntoRuta[] = [];
  puntosPreview: PuntoRuta[] = [];

  ngOnInit(): void {
    this.listarRutas();
  }

  listarRutas(): void {
    this.cargando = true;
    this.rutaService.listar().subscribe({
      next: (data) => {
        if (!data.length) {
          this.rutasLista = [];
          this.aplicarFiltros();
          this.totalActivas = 0;
          this.totalSinGps = 0;
          this.cargando = false;
          this.cdr.detectChanges();
          return;
        }

        forkJoin(
          data.map((ruta) =>
            this.rutaMapaService.obtenerGeometria(ruta.idRuta).pipe(
              map((geo) => ({ ...ruta, mapeable: geo.mapeable })),
              catchError(() => of({ ...ruta, mapeable: false }))
            )
          )
        ).subscribe({
          next: (conGps) => {
            this.rutasLista = conGps;
            this.totalActivas = conGps.filter(r => r.estado === true).length;
            this.totalSinGps = conGps.filter(r => !r.mapeable).length;
            this.aplicarFiltros();
            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.rutasLista = data;
            this.aplicarFiltros();
            this.cargando = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarRutas(event: Event): void {
    this.filtroTexto = (event.target as HTMLInputElement).value.toLowerCase();
    this.aplicarFiltros();
  }

  cambiarFiltroEstado(event: Event): void {
    this.filtroEstado = (event.target as HTMLSelectElement).value;
    this.aplicarFiltros();
  }

  cambiarFiltroGps(event: Event): void {
    this.filtroGps = (event.target as HTMLSelectElement).value;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.rutasFiltradas = this.rutasLista.filter(ruta => {
      const texto = `${ruta.codigo} ${ruta.nombre} ${ruta.origen} ${ruta.destino}`.toLowerCase();
      const coincideTexto = texto.includes(this.filtroTexto);
      const coincideEstado =
        this.filtroEstado === 'TODOS' ||
        (this.filtroEstado === 'ACTIVO' && ruta.estado === true) ||
        (this.filtroEstado === 'INACTIVO' && ruta.estado === false);
      const coincideGps =
        this.filtroGps === 'TODOS' ||
        (this.filtroGps === 'CON_GPS' && ruta.mapeable === true) ||
        (this.filtroGps === 'SIN_GPS' && ruta.mapeable !== true);
      return coincideTexto && coincideEstado && coincideGps;
    });
  }

  limpiarRutasSinGps(): void {
    Swal.fire({
      title: '¿Eliminar rutas sin GPS?',
      html: 'Se borrarán las rutas que no tengan al menos 2 paraderos con coordenadas, junto con sus programaciones, viajes y asignaciones.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar todas',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.rutaService.limpiarSinGps().subscribe({
        next: (res) => {
          this.rutaMapaService.invalidarCache();
          this.listarRutas();
          Swal.fire({
            icon: res.rutasEliminadas ? 'success' : 'info',
            title: res.rutasEliminadas ? 'Limpieza completada' : 'Nada que eliminar',
            html: res.mensaje +
              (res.rutas.length
                ? `<br><br><strong>Rutas:</strong><br>${res.rutas.join('<br>')}`
                : '') +
              `<br><br>Programaciones: <strong>${res.programacionesEliminadas}</strong><br>` +
              `Viajes: <strong>${res.viajesEliminados}</strong>`
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo limpiar',
            text: error.error?.message ?? 'Ocurrió un error.'
          });
        }
      });
    });
  }

  get esNuevaRuta(): boolean {
    return !this.rutaEnEdicion?.idRuta;
  }

  abrirModalCrear(): void {
    this.rutaEnEdicion = null;
    this.pasoWizard = 1;
    this.puntosMapa = [];
    this.marcadoresPreview = [];
    this.puntosPreview = [];
    this.form = {
      codigo: '',
      nombre: '',
      origen: '',
      destino: '',
      descripcion: '',
      distanciaKm: undefined,
      tiempoEstimadoMin: 45,
      estado: true
    };
    this.mostrarModal = true;
  }

  editarRuta(ruta: Ruta): void {
    this.rutaEnEdicion = ruta;
    this.pasoWizard = 1;
    this.puntosMapa = [];
    this.form = { ...ruta };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.rutaEnEdicion = null;
    this.form = {};
    this.pasoWizard = 1;
    this.puntosMapa = [];
  }

  onPuntosMapaChange(puntos: PuntoEdicionRuta[]): void {
    this.puntosMapa = puntos;
    this.sincronizarNombresParadas();
    this.cdr.detectChanges();
  }

  quitarUltimoPunto(): void {
    if (!this.puntosMapa.length) return;
    this.puntosMapa = this.puntosMapa.slice(0, -1).map((p, i) => ({ ...p, orden: i + 1 }));
    this.sincronizarNombresParadas();
  }

  limpiarPuntosMapa(): void {
    this.puntosMapa = [];
  }

  private sincronizarNombresParadas(): void {
    if (!this.puntosMapa.length) return;

    this.puntosMapa[0].nombre = this.form.origen?.trim() || 'Origen';

    if (this.puntosMapa.length === 1) {
      return;
    }

    this.puntosMapa[this.puntosMapa.length - 1].nombre =
      this.form.destino?.trim() || 'Destino';

    for (let i = 1; i < this.puntosMapa.length - 1; i++) {
      this.puntosMapa[i].nombre = `Paradero ${i}`;
    }
  }

  private construirPreview(): void {
    this.marcadoresPreview = this.puntosMapa.map((p, i) => ({
      lat: p.lat,
      lng: p.lng,
      etiqueta: p.nombre,
      tipo: i === 0 ? 'origen' : i === this.puntosMapa.length - 1 ? 'destino' : 'paradero',
      numero: i > 0 && i < this.puntosMapa.length - 1 ? i : undefined
    }));
    this.puntosPreview = [...this.marcadoresPreview];
  }

  siguientePaso(): void {
    if (this.pasoWizard === 1) {
      if (!this.form.codigo?.trim() || !this.form.nombre?.trim()) {
        Swal.fire({ icon: 'warning', title: 'Datos incompletos', text: 'Ingresa código y nombre de la ruta.' });
        return;
      }
      this.form.codigo = this.form.codigo.trim().toUpperCase();
      this.pasoWizard = 2;
      return;
    }

    if (this.pasoWizard === 2) {
      if (this.puntosMapa.length < 2) {
        Swal.fire({
          icon: 'warning',
          title: 'Marca la ruta en el mapa',
          text: 'Necesitas al menos 2 puntos: origen y destino (clic en el mapa).'
        });
        return;
      }
      this.sincronizarNombresParadas();
      this.form.origen = this.puntosMapa[0].nombre;
      this.form.destino = this.puntosMapa[this.puntosMapa.length - 1].nombre;
      this.construirPreview();
      this.pasoWizard = 3;
    }
  }

  pasoAnterior(): void {
    if (this.pasoWizard > 1) {
      this.pasoWizard--;
    }
  }

  guardarRuta(): void {
    if (this.rutaEnEdicion?.idRuta) {
      this.rutaService.actualizar(this.rutaEnEdicion.idRuta, this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarRutas();
          Swal.fire({
            icon: 'success',
            title: 'Ruta actualizada',
            text: 'Se actualizó correctamente.',
            timer: 1800,
            showConfirmButton: false
          });
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'Error', text: error.error?.message });
        }
      });
      return;
    }

    if (this.puntosMapa.length < 2) {
      Swal.fire({ icon: 'warning', title: 'Faltan puntos en el mapa', text: 'Marca origen y destino antes de guardar.' });
      return;
    }

    this.guardando = true;
    this.sincronizarNombresParadas();
    this.form.origen = this.puntosMapa[0].nombre;
    this.form.destino = this.puntosMapa[this.puntosMapa.length - 1].nombre;

    this.rutaService.guardar(this.form).pipe(
      switchMap((ruta) => {
        const peticiones = this.puntosMapa.map((punto, index) =>
          this.paraderoService.guardar({
            idRuta: ruta.idRuta,
            nombre: punto.nombre,
            latitud: punto.lat,
            longitud: punto.lng,
            orden: index + 1,
            estado: true
          })
        );
        return forkJoin(peticiones);
      })
    ).subscribe({
      next: () => {
        this.guardando = false;
        this.rutaMapaService.invalidarCache();
        this.cerrarModal();
        this.listarRutas();
        Swal.fire({
          icon: 'success',
          title: 'Ruta creada con mapa',
          html: 'La ruta y sus paraderos quedaron listos.<br>Programa un viaje y el chofer podrá iniciarla con animación simulada.',
          timer: 3200,
          showConfirmButton: false
        });
      },
      error: (error) => {
        this.guardando = false;
        Swal.fire({ icon: 'error', title: 'Error', text: error.error?.message ?? 'No se pudo guardar la ruta.' });
      }
    });
  }

  eliminarRuta(id: number): void {
    Swal.fire({
      title: '¿Eliminar ruta?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.rutaService.eliminar(id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Ruta eliminada', timer: 1500, showConfirmButton: false });
          this.rutaMapaService.invalidarCache();
          this.listarRutas();
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: error.error?.message ?? 'Ocurrió un error.' });
        }
      });
    });
  }
}
