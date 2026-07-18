import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  cargando = false;
  sinChofer = false;

  rutas: Ruta[] = [];
  programaciones: ProgramacionViaje[] = [];
  viajesHoy: Viaje[] = [];
  viajesPendientes: Viaje[] = [];
  viajesCompletados: Viaje[] = [];
  viajesProximos: Viaje[] = [];

  ngOnInit(): void {
    this.cargando = true;
    const usuario = this.session.obtener();
    if (!usuario?.idUsuario) {
      this.sinChofer = true;
      this.cargando = false;
      return;
    }

    this.rutaService.listar().subscribe({ next: (data) => (this.rutas = data) });
    this.programacionService.listar().subscribe({ next: (data) => (this.programaciones = data) });

    this.choferService.obtenerPorUsuario(usuario.idUsuario).subscribe({
      next: (resp) => {
        this.viajeService.listarPorChofer(resp.data.idChofer).subscribe({
          next: (data) => {
            this.clasificarViajes(data);
            this.cargando = false;
            this.cdr.markForCheck();
          },
          error: () => {
            this.cargando = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: () => {
        this.sinChofer = true;
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  private clasificarViajes(viajes: Viaje[]): void {
    const hoy = this.fechaLocalIso();
    this.viajesHoy = viajes.filter(v => v.fechaViaje === hoy);
    this.viajesPendientes = this.viajesHoy.filter(v =>
      ['PROGRAMADO', 'EN_CURSO', 'EN_RUTA'].includes((v.estado || '').toUpperCase())
    );
    this.viajesCompletados = this.viajesHoy.filter(v =>
      ['FINALIZADO', 'COMPLETADO'].includes((v.estado || '').toUpperCase())
    );
    this.viajesProximos = viajes.filter(v =>
      v.fechaViaje > hoy && (v.estado || '').toUpperCase() !== 'CANCELADO'
    );
  }

  private fechaLocalIso(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  nombreRuta(idProgramacion: number): string {
    const prog = this.programaciones.find(p => p.idProgramacion === idProgramacion);
    if (!prog) return '-';
    return this.rutas.find(r => r.idRuta === prog.idRuta)?.nombre ?? '-';
  }
}
