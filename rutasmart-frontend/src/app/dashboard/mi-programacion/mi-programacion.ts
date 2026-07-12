import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoferService } from '../../service/chofer';
import { ViajeService } from '../../service/viaje';
import { RutaService } from '../../service/ruta';
import { ProgramacionViajeService } from '../../service/programacion-viaje';
import { SessionService } from '../../service/session';
import { Viaje } from '../../models/viaje';
import { Ruta } from '../../models/ruta';
import { ProgramacionViaje } from '../../models/programacion-viaje';

@Component({
  selector: 'app-mi-programacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-programacion.html',
  styleUrls: ['./mi-programacion.css']
})
export class MiProgramacionComponent implements OnInit {

  private choferService = inject(ChoferService);
  private viajeService = inject(ViajeService);
  private rutaService = inject(RutaService);
  private programacionService = inject(ProgramacionViajeService);
  private session = inject(SessionService);

  cargando = false;
  sinChofer = false;

  rutas: Ruta[] = [];
  programaciones: ProgramacionViaje[] = [];
  viajesLista: Viaje[] = [];

  ngOnInit(): void {
    this.cargando = true;
    const usuario = this.session.obtener();

    this.rutaService.listar().subscribe({ next: (data) => this.rutas = data });
    this.programacionService.listar().subscribe({ next: (data) => this.programaciones = data });

    this.choferService.listar().subscribe({
      next: (respuesta) => {
        const chofer = respuesta.data.find(c => c.idUsuario === usuario?.idUsuario);

        if (!chofer) {
          this.sinChofer = true;
          this.cargando = false;
          return;
        }

        this.viajeService.listar().subscribe({
          next: (data) => {
            this.viajesLista = data
              .filter(v => v.idChofer === chofer.idChofer)
              .sort((a, b) => b.fechaViaje.localeCompare(a.fechaViaje));
            this.cargando = false;
          },
          error: () => {
            this.cargando = false;
          }
        });
      },
      error: () => {
        this.sinChofer = true;
        this.cargando = false;
      }
    });
  }

  nombreRuta(idProgramacion: number): string {
    const prog = this.programaciones.find(p => p.idProgramacion === idProgramacion);
    if (!prog) return '-';
    return this.rutas.find(r => r.idRuta === prog.idRuta)?.nombre ?? '-';
  }

}
