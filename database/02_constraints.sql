/****************************************************************************************
* PROYECTO : RutaSmart V2
* ARCHIVO  : 02_constraints.sql
* MOTOR    : PostgreSQL / Supabase
* DESCRIPCIÓN:
* Restricciones de integridad del sistema.
****************************************************************************************/
-- ============================================================
-- TABLA: ROLES
-- ============================================================

ALTER TABLE roles
ADD CONSTRAINT uq_roles_nombre
UNIQUE(nombre);

-- ============================================================
-- TABLA: USUARIOS
-- ============================================================

ALTER TABLE usuarios
ADD CONSTRAINT uq_usuario_codigo
UNIQUE(codigo);

ALTER TABLE usuarios
ADD CONSTRAINT uq_usuario_correo
UNIQUE(correo);

-- ============================================================
-- TABLA: ALUMNOS
-- ============================================================

ALTER TABLE alumnos
ADD CONSTRAINT uq_alumno_usuario
UNIQUE(id_usuario);

ALTER TABLE alumnos
ADD CONSTRAINT uq_codigo_universitario
UNIQUE(codigo_universitario);

ALTER TABLE alumnos
ADD CONSTRAINT chk_alumno_ciclo
CHECK(ciclo BETWEEN 1 AND 12);

-- ============================================================
-- TABLA: CHOFERES
-- ============================================================

ALTER TABLE choferes
ADD CONSTRAINT uq_chofer_usuario
UNIQUE(id_usuario);

ALTER TABLE choferes
ADD CONSTRAINT uq_chofer_licencia
UNIQUE(licencia);

-- ============================================================
-- TABLA: BUSES
-- ============================================================

ALTER TABLE buses
ADD CONSTRAINT uq_bus_codigo
UNIQUE(codigo);

ALTER TABLE buses
ADD CONSTRAINT uq_bus_placa
UNIQUE(placa);

ALTER TABLE buses
ADD CONSTRAINT chk_bus_capacidad
CHECK(capacidad_asientos > 0);

ALTER TABLE buses
ADD CONSTRAINT chk_bus_anio
CHECK(anio >= 2000);

ALTER TABLE buses
ADD CONSTRAINT chk_bus_estado
CHECK(
estado IN (
TRUE,
FALSE
)
);


-- ============================================================
-- TABLA: RUTAS
-- ============================================================

ALTER TABLE rutas
ADD CONSTRAINT uq_ruta_codigo
UNIQUE(codigo);

ALTER TABLE rutas
ADD CONSTRAINT chk_distancia
CHECK(distancia_km > 0);

ALTER TABLE rutas
ADD CONSTRAINT chk_tiempo
CHECK(tiempo_estimado_min > 0);

-- ============================================================
-- TABLA: PARADEROS
-- ============================================================

ALTER TABLE paraderos
ADD CONSTRAINT chk_paradero_orden
CHECK(orden > 0);

ALTER TABLE paraderos
ADD CONSTRAINT chk_latitud
CHECK(latitud BETWEEN -90 AND 90);

ALTER TABLE paraderos
ADD CONSTRAINT chk_longitud
CHECK(longitud BETWEEN -180 AND 180);

-- ============================================================
-- TABLA: PROGRAMACION_VIAJES
-- ============================================================

ALTER TABLE programacion_viajes
ADD CONSTRAINT chk_hora_programacion
CHECK(hora_llegada_estimada > hora_salida);

-- ============================================================
-- TABLA: VIAJES
-- ============================================================

ALTER TABLE viajes
ADD CONSTRAINT chk_estado_viaje
CHECK(

estado IN (

'PROGRAMADO',

'EN_CURSO',

'FINALIZADO',

'CANCELADO'

)

);

ALTER TABLE viajes
ADD CONSTRAINT chk_fechas_viaje
CHECK(

hora_fin_real IS NULL

OR

hora_fin_real >= hora_inicio_real

);


-- ============================================================
-- TABLA: RESERVAS
-- ============================================================

ALTER TABLE reservas
ADD CONSTRAINT uq_reserva_alumno_viaje
UNIQUE(id_alumno,id_viaje);

ALTER TABLE reservas
ADD CONSTRAINT uq_codigo_qr
UNIQUE(codigo_qr);

ALTER TABLE reservas
ADD CONSTRAINT chk_estado_reserva
CHECK(

estado IN (

'RESERVADO',

'ABORDADO',

'CANCELADO',

'NO_ASISTIO'

)

);

-- ============================================================
-- TABLA: UBICACION_BUS
-- ============================================================

ALTER TABLE ubicacion_bus
ADD CONSTRAINT chk_velocidad
CHECK(

velocidad IS NULL

OR

velocidad >= 0

);

ALTER TABLE ubicacion_bus
ADD CONSTRAINT chk_latitud_bus
CHECK(latitud BETWEEN -90 AND 90);

ALTER TABLE ubicacion_bus
ADD CONSTRAINT chk_longitud_bus
CHECK(longitud BETWEEN -180 AND 180);


-- ============================================================
-- TABLA: INCIDENCIAS
-- ============================================================

ALTER TABLE incidencias
ADD CONSTRAINT chk_estado_incidencia
CHECK(

estado IN (

'PENDIENTE',

'EN_PROCESO',

'RESUELTA'

)

);

-- ============================================================
-- TABLA: NOTIFICACIONES
-- ============================================================

ALTER TABLE notificaciones
ADD CONSTRAINT chk_tipo_notificacion
CHECK(

tipo IN (

'RESERVA',

'RECORDATORIO',

'INCIDENCIA',

'SISTEMA'

)

);


ALTER TABLE asignacion_programacion
ADD CONSTRAINT fk_asig_programacion
FOREIGN KEY (id_programacion)
REFERENCES programacion_viajes(id_programacion);

ALTER TABLE asignacion_programacion
ADD CONSTRAINT fk_asig_bus
FOREIGN KEY (id_bus)
REFERENCES buses(id_bus);

ALTER TABLE asignacion_programacion
ADD CONSTRAINT fk_asig_chofer
FOREIGN KEY (id_chofer)
REFERENCES choferes(id_chofer);

ALTER TABLE asignacion_programacion
ADD CONSTRAINT chk_asignacion_fechas
CHECK (
    fecha_fin IS NULL
    OR fecha_fin >= fecha_inicio
);