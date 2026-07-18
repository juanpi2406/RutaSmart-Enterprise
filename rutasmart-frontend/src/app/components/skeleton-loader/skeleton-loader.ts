import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sk-wrap" [class.sk-wrap--compact]="compact">
      @for(row of filas; track row){
        <div class="sk-row" [style.width.%]="anchoFila(row)">
          <div class="sk-shimmer"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .sk-wrap { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
    .sk-wrap--compact { gap: 8px; }
    .sk-row { height: 14px; border-radius: 8px; overflow: hidden; background: rgba(255,255,255,.04); }
    .sk-shimmer {
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent);
      animation: sk 1.2s infinite;
    }
    @keyframes sk { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
  `]
})
export class SkeletonLoaderComponent {
  @Input() lineas = 4;
  @Input() compact = false;

  get filas(): number[] {
    return Array.from({ length: this.lineas }, (_, i) => i);
  }

  anchoFila(i: number): number {
    const widths = [100, 92, 78, 85, 65];
    return widths[i % widths.length];
  }
}
