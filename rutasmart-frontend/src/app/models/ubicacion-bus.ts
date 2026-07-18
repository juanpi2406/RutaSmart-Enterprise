export interface UbicacionBus {
  idUbicacion?: number;
  idViaje: number;
  latitud: number;
  longitud: number;
  velocidad?: number;
  fechaHora?: string;
  codigoRuta?: string;
}
