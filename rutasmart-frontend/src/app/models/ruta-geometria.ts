import { PuntoRuta } from '../config/ruta-javier-prado';

export interface RutaGeometria {
  idRuta: number;
  codigo: string;
  nombre: string;
  origen: string;
  destino: string;
  mapeable: boolean;
  mensaje?: string;
  marcadores: PuntoRuta[];
  puntos: PuntoRuta[];
}

export interface RutaMapaView extends RutaGeometria {
  colorPrimario: string;
  colorDestino: string;
}

export const PALETA_RUTAS = [
  { primario: '#dc2626', destino: '#2563eb' },
  { primario: '#16a34a', destino: '#7c3aed' },
  { primario: '#d97706', destino: '#0891b2' },
  { primario: '#db2777', destino: '#4f46e5' },
  { primario: '#059669', destino: '#ca8a04' },
  { primario: '#7c3aed', destino: '#dc2626' }
];

export function colorParaIndice(indice: number): { primario: string; destino: string } {
  return PALETA_RUTAS[indice % PALETA_RUTAS.length];
}
