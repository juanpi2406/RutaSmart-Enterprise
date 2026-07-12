import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  standalone: true,
  templateUrl: './reportes.html'
})
export class ReportesComponent {
  exportarPDF() {
    console.log('Generando archivo PDF con las métricas de RutaSmart...');
  }
}
