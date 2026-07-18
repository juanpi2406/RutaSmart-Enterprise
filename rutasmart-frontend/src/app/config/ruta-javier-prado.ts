export type TipoPuntoRuta = 'origen' | 'paradero' | 'destino' | 'trayecto';

export interface PuntoRuta {
  lat: number;
  lng: number;
  etiqueta: string;
  tipo: TipoPuntoRuta;
  /** Número de paradero en la línea (1…n) o null en extremos. */
  numero?: number;
}

/** Código visible de la línea en el mapa. */
export const CODIGO_RUTA = 'R-01';
export const NOMBRE_RUTA = 'UTP Lima Sur → Mall del Sur';

/**
 * Ruta real aproximada por Panamericana Sur:
 * UTP Lima Sur (Km 16) → Mall del Sur (SJM).
 */
export const RUTA_UTP_MALL_DEL_SUR: PuntoRuta[] = [
  {
    lat: -12.2168,
    lng: -76.9362,
    etiqueta: 'UTP Lima Sur',
    tipo: 'origen'
  },
  {
    lat: -12.2105,
    lng: -76.9418,
    etiqueta: 'Paradero 1',
    tipo: 'paradero',
    numero: 1
  },
  {
    lat: -12.2038,
    lng: -76.9485,
    etiqueta: 'Paradero 2',
    tipo: 'paradero',
    numero: 2
  },
  {
    lat: -12.1965,
    lng: -76.9552,
    etiqueta: 'Paradero 3',
    tipo: 'paradero',
    numero: 3
  },
  {
    lat: -12.1892,
    lng: -76.9615,
    etiqueta: 'Paradero 4',
    tipo: 'paradero',
    numero: 4
  },
  {
    lat: -12.1818,
    lng: -76.9672,
    etiqueta: 'Paradero 5',
    tipo: 'paradero',
    numero: 5
  },
  {
    lat: -12.1745,
    lng: -76.9725,
    etiqueta: 'Paradero 6',
    tipo: 'paradero',
    numero: 6
  },
  {
    lat: -12.1678,
    lng: -76.9768,
    etiqueta: 'Paradero 7',
    tipo: 'paradero',
    numero: 7
  },
  {
    lat: -12.1615,
    lng: -76.9798,
    etiqueta: 'Paradero 8',
    tipo: 'paradero',
    numero: 8
  },
  {
    lat: -12.1582,
    lng: -76.9812,
    etiqueta: 'Paradero 9',
    tipo: 'paradero',
    numero: 9
  },
  {
    lat: -12.15516,
    lng: -76.98201,
    etiqueta: 'Mall del Sur',
    tipo: 'destino'
  }
];

/** Alias de compatibilidad. */
export const RUTA_JAVIER_PRADO_UTP = RUTA_UTP_MALL_DEL_SUR;
export const RUTA_UTP_JAVIER_PRADO = RUTA_UTP_MALL_DEL_SUR;

/** Ruta R-02: UTP Lima Sur → Polideportivo de Villa El Salvador */
export const CODIGO_RUTA_02 = 'R-02';
export const NOMBRE_RUTA_02 = 'UTP Lima Sur → Polideportivo VES';

export const RUTA_UTP_POLIDEPORTIVO_VES: PuntoRuta[] = [
  {
    lat: -12.2168,
    lng: -76.9362,
    etiqueta: 'UTP Lima Sur',
    tipo: 'origen'
  },
  {
    lat: -12.2195,
    lng: -76.9290,
    etiqueta: 'Paradero 1',
    tipo: 'paradero',
    numero: 1
  },
  {
    lat: -12.2218,
    lng: -76.9215,
    etiqueta: 'Paradero 2',
    tipo: 'paradero',
    numero: 2
  },
  {
    lat: -12.2235,
    lng: -76.9142,
    etiqueta: 'Paradero 3',
    tipo: 'paradero',
    numero: 3
  },
  {
    lat: -12.2248,
    lng: -76.9068,
    etiqueta: 'Paradero 4',
    tipo: 'paradero',
    numero: 4
  },
  {
    lat: -12.2260,
    lng: -76.8995,
    etiqueta: 'Paradero 5',
    tipo: 'paradero',
    numero: 5
  },
  {
    lat: -12.2268,
    lng: -76.8920,
    etiqueta: 'Paradero 6',
    tipo: 'paradero',
    numero: 6
  },
  {
    lat: -12.2272,
    lng: -76.8845,
    etiqueta: 'Paradero 7',
    tipo: 'paradero',
    numero: 7
  },
  {
    lat: -12.2270,
    lng: -76.8768,
    etiqueta: 'Paradero 8',
    tipo: 'paradero',
    numero: 8
  },
  {
    lat: -12.2265,
    lng: -76.8695,
    etiqueta: 'Polideportivo VES',
    tipo: 'destino'
  }
];

export function puntoToLatLng(p: PuntoRuta): { lat: number; lng: number } {
  return { lat: p.lat, lng: p.lng };
}

/** Compat: left/top como proyección simple para APIs legacy. */
export function puntoToPercent(p: PuntoRuta): { left: number; top: number } {
  return { left: p.lng, top: p.lat };
}

export function longitudesAcumuladas(puntos: PuntoRuta[]): number[] {
  const acc = [0];
  for (let i = 1; i < puntos.length; i++) {
    const a = puntos[i - 1];
    const b = puntos[i];
    acc.push(acc[i - 1] + haversineM(a.lat, a.lng, b.lat, b.lng));
  }
  return acc;
}

export function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Posición a lo largo de la ruta: t ∈ [0, 1]. */
export function interpolarRuta(
  puntos: PuntoRuta[],
  t: number
): { lat: number; lng: number; bearing: number; segmento: number } {
  const clamped = Math.max(0, Math.min(1, t));
  const acc = longitudesAcumuladas(puntos);
  const total = acc[acc.length - 1] || 1;
  const target = clamped * total;

  let i = 0;
  while (i < acc.length - 2 && acc[i + 1] < target) i++;

  const segLen = Math.max(acc[i + 1] - acc[i], 0.0001);
  const localT = (target - acc[i]) / segLen;
  const a = puntos[i];
  const b = puntos[i + 1];

  return {
    lat: a.lat + (b.lat - a.lat) * localT,
    lng: a.lng + (b.lng - a.lng) * localT,
    bearing: bearingDeg(a.lat, a.lng, b.lat, b.lng),
    segmento: i
  };
}

export function bearingDeg(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Progreso 0–1 más cercano a una coordenada sobre la polilínea. */
export function progresoDesdeCoords(puntos: PuntoRuta[], lat: number, lng: number): number {
  const acc = longitudesAcumuladas(puntos);
  const total = acc[acc.length - 1] || 1;
  let mejor = 0;
  let mejorDist = Number.MAX_VALUE;

  for (let i = 0; i < puntos.length - 1; i++) {
    const a = puntos[i];
    const b = puntos[i + 1];
    for (let s = 0; s <= 20; s++) {
      const t = s / 20;
      const plat = a.lat + (b.lat - a.lat) * t;
      const plng = a.lng + (b.lng - a.lng) * t;
      const d = haversineM(lat, lng, plat, plng);
      if (d < mejorDist) {
        mejorDist = d;
        mejor = (acc[i] + (acc[i + 1] - acc[i]) * t) / total;
      }
    }
  }
  return mejor;
}

export function indiceDesdeProgreso(puntos: PuntoRuta[], progreso: number): number {
  const acc = longitudesAcumuladas(puntos);
  const total = acc[acc.length - 1] || 1;
  const target = progreso * total;
  let i = 0;
  while (i < puntos.length - 1 && acc[i + 1] <= target + 1) i++;
  return i;
}
