import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoferService } from '../../service/chofer';
import { AsignacionProgramacionService } from '../../service/asignacion-programacion';
import { ProgramacionViajeService } from '../../service/programacion-viaje';
import { RutaService } from '../../service/ruta';
import { ParaderoService } from '../../service/paradero';
import { SessionService } from '../../service/session';
import { AsignacionProgramacion } from '../../models/asignacion-programacion';
import { ProgramacionViaje } from '../../models/programacion-viaje';
import { Ruta } from '../../models/ruta';
import { Paradero } from '../../models/paradero';

@Component({
  selector: 'app-mi-ruta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-ruta.html',
  styleUrls: ['./mi-ruta.css']
})
export class MiRutaComponent implements OnInit {

  private choferService = inject(ChoferService);
  private asignacionService = inject(AsignacionProgramacionService);
  private programacionService = inject(ProgramacionViajeService);
  private rutaService = inject(RutaService);
  private paraderoService = inject(ParaderoService);
  private session = inject(SessionService);

  cargando = false;
  sinAsignacion = false;

  ruta: Ruta | null = null;
  programacion: ProgramacionViaje | null = null;
  paraderos: Paradero[] = [];

  ngOnInit(): void {
    this.cargando = true;
    const usuario = this.session.obtener();

    this.choferService.listar().subscribe({
      next: (respuesta) => {
        const chofer = respuesta.data.find(c => c.idUsuario === usuario?.idUsuario);

        if (!chofer) {
          this.sinAsignacion = true;
          this.cargando = false;
          return;
        }

        this.cargarAsignacion(chofer.idChofer);
      },
      error: () => {
        this.sinAsignacion = true;
        this.cargando = false;
      }
    });
  }

  private cargarAsignacion(idChofer: number): void {

    const hoy = new Date().toISOString().substring(0, 10);

    this.asignacionService.listar().subscribe({
      next: (data) => {
        const vigente = data.find(a =>
          a.idChofer === idChofer &&
          a.estado === true &&
          a.fechaInicio <= hoy &&
          (!a.fechaFin || a.fechaFin >= hoy)
        );

        if (!vigente) {
          this.sinAsignacion = true;
          this.cargando = false;
          return;
        }

        this.cargarProgramacion(vigente);
      },
      error: () => {
        this.sinAsignacion = true;
        this.cargando = false;
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
      }
    });

  }

  private cargarRuta(idRuta: number): void {

    this.rutaService.buscarPorId(idRuta).subscribe({
      next: (ruta) => {
        this.ruta = ruta;
        this.cargarParaderos(idRuta);
      },
      error: () => {
        this.cargando = false;
      }
    });

  }

  private cargarParaderos(idRuta: number): void {

    this.paraderoService.listarPorRuta(idRuta).subscribe({
      next: (data) => {
        this.paraderos = data.sort((a, b) => a.orden - b.orden);
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });

  }

}
