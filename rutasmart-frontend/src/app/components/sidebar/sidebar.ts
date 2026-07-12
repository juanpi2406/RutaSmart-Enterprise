import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {

  @Input() nombreUsuario = '';

  @Input() rolUsuario = '';

  personasOpen = false;

  transporteOpen = false;

  operacionesOpen = false;

  monitoreoOpen = false;

  reportesOpen = false;

  toggle(menu: string) {

    switch(menu){

      case 'personas':

        this.personasOpen = !this.personasOpen;

        break;

      case 'transporte':

        this.transporteOpen = !this.transporteOpen;

        break;

      case 'operaciones':

        this.operacionesOpen = !this.operacionesOpen;

        break;

      case 'monitoreo':

        this.monitoreoOpen = !this.monitoreoOpen;

        break;

      case 'reportes':

        this.reportesOpen = !this.reportesOpen;

        break;

    }

  }

}
