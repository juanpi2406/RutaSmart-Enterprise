import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transporte.html'
})
export class TransporteComponent implements OnInit {

  // Simulación de los datos reales de tu BusRepository del backend
  flotaLista = [
    { id: 1, codigo: 'BUS-01', placa: 'ABC-123', capacidad: 40, modelo: 'Mercedes-Benz Sprinter', estado: 'Operativo' },
    { id: 2, codigo: 'BUS-02', placa: 'XYZ-789', capacidad: 45, modelo: 'Volvo Fly', estado: 'En Ruta' },
    { id: 3, codigo: 'BUS-03', placa: 'MNO-456', capacidad: 30, modelo: 'Hyundai County', estado: 'Mantenimiento' },
    { id: 4, codigo: 'BUS-04', placa: 'FTW-882', capacidad: 40, modelo: 'Mercedes-Benz Sprinter', estado: 'Operativo' }
  ];

  flotaFiltrada = [...this.flotaLista];
  filtroTexto: string = '';
  filtroEstado: string = 'TODOS';

  ngOnInit() {
    this.aplicarFiltros();
  }

  filtrarFlota(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filtroTexto = input.value.toLowerCase();
    this.aplicarFiltros();
  }

  cambiarFiltroEstado(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filtroEstado = select.value;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.flotaFiltrada = this.flotaLista.filter(b => {
      const coincideTexto = b.codigo.toLowerCase().includes(this.filtroTexto) || b.placa.toLowerCase().includes(this.filtroTexto);
      const coincideEstado = this.filtroEstado === 'TODOS' || b.estado === this.filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }

  abrirModalBus() {
    console.log('Abrir formulario para agregar un nuevo bus');
  }

  editarBus(bus: any) {
    console.log('Editando información del bus:', bus);
  }

  eliminarBus(id: number) {
    console.log('Eliminando registro de bus con ID:', id);
  }
}
