import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingService } from '../../service/onboarding.service';

@Component({
  selector: 'app-onboarding-tour',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if(visible && pasoActual){
    <div class="tour-overlay">
      <div class="tour-card">
        <span class="tour-step">{{ indice + 1 }} / {{ pasos.length }}</span>
        <i class="bi" [ngClass]="pasoActual.icono"></i>
        <h3>{{ pasoActual.titulo }}</h3>
        <p>{{ pasoActual.texto }}</p>
        <div class="tour-actions">
          <button type="button" class="tour-skip" (click)="cerrar()">Omitir</button>
          <button type="button" class="tour-next" (click)="siguiente()">
            {{ indice < pasos.length - 1 ? 'Siguiente' : 'Empezar' }}
          </button>
        </div>
      </div>
    </div>
    }
  `,
  styles: [`
    .tour-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,.65); display: flex; align-items: center; justify-content: center; padding: 20px;
    }
    .tour-card {
      max-width: 400px; width: 100%; background: #161927; border: 1px solid rgba(220,38,38,.25);
      border-radius: 16px; padding: 28px; text-align: center;
    }
    .tour-step { font-size: 11px; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .08em; }
    .tour-card > i { font-size: 36px; color: #dc2626; display: block; margin: 14px 0; }
    .tour-card h3 { margin: 0 0 10px; color: #fff; font-size: 18px; }
    .tour-card p { margin: 0 0 20px; color: rgba(255,255,255,.6); font-size: 13px; line-height: 1.5; }
    .tour-actions { display: flex; gap: 10px; justify-content: center; }
    .tour-skip { background: transparent; border: 1px solid rgba(255,255,255,.15); color: rgba(255,255,255,.6);
      border-radius: 10px; padding: 10px 16px; cursor: pointer; font-family: inherit; }
    .tour-next { background: #dc2626; border: none; color: #fff; border-radius: 10px; padding: 10px 20px;
      font-weight: 600; cursor: pointer; font-family: inherit; }
  `]
})
export class OnboardingTourComponent implements OnInit {
  @Input() rol = '';
  @Output() completado = new EventEmitter<void>();

  private onboarding = inject(OnboardingService);
  visible = false;
  pasos: { titulo: string; texto: string; icono: string }[] = [];
  indice = 0;

  get pasoActual() { return this.pasos[this.indice]; }

  ngOnInit(): void {
    if (!this.rol || this.onboarding.completado(this.rol)) return;
    this.pasos = this.onboarding.pasosParaRol(this.rol);
    this.visible = this.pasos.length > 0;
  }

  siguiente(): void {
    if (this.indice < this.pasos.length - 1) {
      this.indice++;
    } else {
      this.cerrar();
    }
  }

  cerrar(): void {
    this.onboarding.marcarCompletado(this.rol);
    this.visible = false;
    this.completado.emit();
  }
}
