import { MenuItem } from "../models/menu-item";

export const MENU: MenuItem[] = [

  // =====================================================
  // DASHBOARD
  // =====================================================

  {
    titulo: 'Dashboard',
    icono: 'bi-speedometer2',
    ruta: '/dashboard',
    roles: ['ADMINISTRADOR', 'ALUMNO', 'CHOFER']
  },

  // =====================================================
  // ADMINISTRACIÓN
  // =====================================================

  {
    titulo: 'Usuarios',
    icono: 'bi-people-fill',
    ruta: '/dashboard/usuarios',
    roles: ['ADMINISTRADOR']
  },

  // =====================================================
  // TRANSPORTE
  // =====================================================

  {
    titulo: 'Buses',
    icono: 'bi-bus-front-fill',
    ruta: '/dashboard/buses',
    roles: ['ADMINISTRADOR']
  },

  {
    titulo: 'Rutas',
    icono: 'bi-sign-turn-right-fill',
    ruta: '/dashboard/rutas',
    roles: ['ADMINISTRADOR']
  },

  // =====================================================
  // OPERACIONES
  // =====================================================

  {
    titulo: 'Programaciones',
    icono: 'bi-calendar-event-fill',
    ruta: '/dashboard/programaciones',
    roles: ['ADMINISTRADOR']
  },

  {
    titulo: 'Viajes',
    icono: 'bi-map-fill',
    ruta: '/dashboard/viajes',
    roles: ['ADMINISTRADOR']
  },

  {
    titulo: 'Reservas',
    icono: 'bi-ticket-perforated-fill',
    ruta: '/dashboard/reservas',
    roles: ['ADMINISTRADOR']
  },

  {
    titulo: 'Incidencias',
    icono: 'bi-exclamation-triangle-fill',
    ruta: '/dashboard/incidencias',
    roles: ['ADMINISTRADOR', 'CHOFER']
  },

  // =====================================================
  // CHOFER
  // =====================================================

  {
    titulo: 'Mi Ruta',
    icono: 'bi-sign-turn-right-fill',
    ruta: '/dashboard/mi-ruta',
    roles: ['CHOFER']
  },

  {
    titulo: 'Mi Programación',
    icono: 'bi-calendar-check-fill',
    ruta: '/dashboard/mi-programacion',
    roles: ['CHOFER']
  },

  {
    titulo: 'Reportar Incidencia',
    icono: 'bi-cone-striped',
    ruta: '/dashboard/reportar-incidencia',
    roles: ['CHOFER']
  },

  // =====================================================
  // ALUMNO
  // =====================================================

  {
    titulo: 'Reservar Viaje',
    icono: 'bi-bookmark-check-fill',
    ruta: '/dashboard/reservar',
    roles: ['ALUMNO']
  },

  {
    titulo: 'Mis Reservas',
    icono: 'bi-journal-bookmark-fill',
    ruta: '/dashboard/mis-reservas',
    roles: ['ALUMNO']
  },

  {
    titulo: 'Incidencias',
    icono: 'bi-exclamation-triangle-fill',
    ruta: '/dashboard/incidencias',
    roles: ['ALUMNO']
  },

  {
    titulo: 'Notificaciones',
    icono: 'bi-bell-fill',
    ruta: '/dashboard/notificaciones',
    roles: ['CHOFER']
  },

  {
    titulo: 'Mi Perfil',
    icono: 'bi-person-circle',
    ruta: '/dashboard/perfil',
    roles: ['ADMINISTRADOR', 'ALUMNO', 'CHOFER']
  },

  // =====================================================
  // REPORTES
  // =====================================================

  {
    titulo: 'Reportes',
    icono: 'bi-bar-chart-fill',
    ruta: '/dashboard/reportes',
    roles: ['ADMINISTRADOR']
  },

  // =====================================================
  // CONFIGURACIÓN
  // =====================================================

  {
    titulo: 'Configuración',
    icono: 'bi-gear-fill',
    ruta: '/dashboard/configuracion',
    roles: ['ADMINISTRADOR']
  }

];
