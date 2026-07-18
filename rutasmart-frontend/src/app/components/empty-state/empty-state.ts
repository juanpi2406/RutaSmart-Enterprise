import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty">
      <i class="bi" [ngClass]="icono"></i>
      <h3>{{ titulo }}</h3>
      <p>{{ descripcion }}</p>
      @if(etiquetaAccion){
        <button type="button" class="empty-btn" (click)="accion.emit()">
          {{ etiquetaAccion }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty { text-align: center; padding: 36px 24px; color: rgba(255,255,255,.45); }
    .empty i { font-size: 42px; color: #dc2626; opacity: .7; display: block; margin-bottom: 12px; }
    .empty h3 { margin: 0 0 8px; color: #fff; font-size: 16px; }
    .empty p { margin: 0 0 16px; font-size: 13px; max-width: 360px; margin-inline: auto; line-height: 1.5; }
    .empty-btn {
      background: #dc2626; color: #fff; border: none; border-radius: 10px;
      padding: 10px 18px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit;
    }
    .empty-btn:hover { background: #b91c1c; }
  `]
})
export class EmptyStateComponent {
  @Input() icono = 'bi-inbox';
  @Input() titulo = 'Sin datos';
  @Input() descripcion = '';
  @Input() etiquetaAccion = '';
  @Output() accion = new EventEmitter<void>();
}
