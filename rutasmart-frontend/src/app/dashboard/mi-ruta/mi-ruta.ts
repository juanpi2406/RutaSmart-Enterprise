import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoferService } from '../../service/chofer';
import { AsignacionProgramacionService } from '../../service/asignacion-programacion';
import { ProgramacionViajeService } from '../../service/programacion-viaje';
import { RutaService } from '../../service/ruta';
import { ParaderoService } from '../../service/paradero';
import { RutaMapaService } from '../../service/ruta-mapa.service';
import { SessionService } from '../../service/session';
import { RouteMapComponent } from '../../components/route-map/route-map.component';
import { AsignacionProgramacion } from '../../models/asignacion-programacion';
import { ProgramacionViaje } from '../../models/programacion-viaje';
import { Ruta } from '../../models/ruta';
import { Paradero } from '../../models/paradero';
import { RutaMapaView } from '../../models/ruta-geometria';

@Component({
  selector: 'app-mi-ruta',
  standalone: true,
  imports: [CommonModule, RouteMapComponent],
  templateUrl: './mi-ruta.html',
  styleUrls: ['./mi-ruta.css']
})
export class MiRutaComponent implements OnInit {

  private choferService = inject(ChoferService);
  private asignacionService = inject(AsignacionProgramacionService);
  private programacionService = inject(ProgramacionViajeService);
  private rutaService = inject(RutaService);
  private paraderoService = inject(ParaderoService);
  private rutaMapaService = inject(RutaMapaService);
  private session = inject(SessionService);
  private cdr = inject(ChangeDetectorRef);

  cargando = false;
  sinAsignacion = false;
  errorMsg = '';

  ruta: Ruta | null = null;
  programacion: ProgramacionViaje | null = null;
  paraderos: Paradero[] = [];
  mapa: RutaMapaView | null = null;

  ngOnInit(): void {
    this.cargando = true;
    const usuario = this.session.obtener();
    if (!usuario?.idUsuario) {
      this.sinAsignacion = true;
      this.cargando = false;
      return;
    }

    this.choferService.obtenerPorUsuario(usuario.idUsuario).subscribe({
      next: (resp) => this.cargarAsignacion(resp.data.idChofer),
      error: () => {
        this.sinAsignacion = true;
        this.errorMsg = 'No se encontró tu perfil de chofer.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  private cargarAsignacion(idChofer: number): void {
    const hoy = new Date().toISOString().substring(0, 10);

    this.asignacionService.listarPorChofer(idChofer).subscribe({
      next: (data) => {
        const vigente = data.find(a =>
          a.estado === true &&
          a.fechaInicio <= hoy &&
          (!a.fechaFin || a.fechaFin >= hoy)
        );

        if (!vigente) {
          this.sinAsignacion = true;
          this.errorMsg = 'No tienes una ruta asignada actualmente.';
          this.cargando = false;
          this.cdr.markForCheck();
          return;
        }

        this.cargarProgramacion(vigente);
      },
      error: () => {
        this.sinAsignacion = true;
        this.errorMsg = 'No se pudieron cargar tus asignaciones.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  private cargarProgramacion(asignacion: AsignacionProgramacion): void {
    this.programacionService.buscarPorId(asignacion.idProgramacion).subscribe({
      next: (programacion) => {
        this.programacion = programacion;
        this.cargarRuta(programacion.idRuta);
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  private cargarRuta(idRuta: number): void {
    this.rutaService.buscarPorId(idRuta).subscribe({
      next: (ruta) => {
        this.ruta = ruta;
        this.cargarParaderos(idRuta);
        this.rutaMapaService.cargarMapa(idRuta).subscribe({
          next: (mapa) => {
            this.mapa = mapa;
            this.cdr.markForCheck();
          }
        });
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  private cargarParaderos(idRuta: number): void {
    this.paraderoService.listarPorRuta(idRuta).subscribe({
      next: (data) => {
        this.paraderos = data.sort((a, b) => a.orden - b.orden);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
