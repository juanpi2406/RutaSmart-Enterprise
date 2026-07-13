/****************************************************************************************
* PROYECTO : RutaSmart Enterprise
* ARCHIVO  : 08_clean.sql
* MOTOR    : PostgreSQL / Supabase
*
* DESCRIPCIÓN:
* Limpia todos los datos del sistema.
* NO elimina tablas.
* NO elimina funciones.
* NO elimina vistas.
* NO elimina índices.
* Reinicia los IDs.
****************************************************************************************/

BEGIN;

TRUNCATE TABLE

reservas,

ubicacion_bus,

incidencias,

notificaciones,

viajes,

asignacion_programacion,

programacion_viajes,

paraderos,

rutas,

buses,

alumnos,

choferes,

usuarios,

roles

RESTART IDENTITY CASCADE;

COMMIT;