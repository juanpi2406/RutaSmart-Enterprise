/****************************************************************************************
* PROYECTO : RutaSmart V2
* ARCHIVO  : 03_indexes.sql
* MOTOR    : PostgreSQL / Supabase
*
* Índices optimizados para las consultas reales del sistema.
*
* NOTA:
* No se crean índices sobre PRIMARY KEY ni UNIQUE, porque PostgreSQL
* ya los genera automáticamente.
****************************************************************************************/

CREATE INDEX idx_usuario_rol
ON usuarios(id_rol);

CREATE INDEX idx_usuario_estado
ON usuarios(estado);

CREATE INDEX idx_bus_estado
ON buses(estado);

CREATE INDEX idx_ruta_nombre
ON rutas(nombre);

CREATE INDEX idx_paradero_ruta_orden
ON paraderos(id_ruta, orden);

CREATE INDEX idx_programacion_ruta_hora
ON programacion_viajes(id_ruta,hora_salida);

CREATE INDEX idx_viaje_fecha_estado
ON viajes(fecha_viaje,estado);

CREATE INDEX idx_viaje_bus
ON viajes(id_bus);

CREATE INDEX idx_viaje_chofer
ON viajes(id_chofer);

CREATE INDEX idx_viaje_programacion
ON viajes(id_programacion);

CREATE INDEX idx_reserva_viaje_estado
ON reservas(id_viaje,estado);

CREATE INDEX idx_reserva_fecha
ON reservas(fecha_reserva);

CREATE INDEX idx_reserva_paradero
ON reservas(id_paradero);

CREATE INDEX idx_ubicacion_viaje_fecha
ON ubicacion_bus(id_viaje,fecha_hora);

CREATE INDEX idx_incidencia_viaje
ON incidencias(id_viaje);

CREATE INDEX idx_incidencia_estado
ON incidencias(estado);

CREATE INDEX idx_incidencia_usuario
ON incidencias(id_usuario);

CREATE INDEX idx_notificacion_usuario_leido
ON notificaciones(id_usuario,leido);



CREATE INDEX idx_asignacion_programacion
ON asignacion_programacion(id_programacion);

CREATE INDEX idx_asignacion_bus
ON asignacion_programacion(id_bus);

CREATE INDEX idx_asignacion_chofer
ON asignacion_programacion(id_chofer);

CREATE INDEX idx_asignacion_estado
ON asignacion_programacion(estado);

