/****************************************************************************************
* PROYECTO : RutaSmart V2
* ARCHIVO  : 05_views.sql
* MOTOR    : PostgreSQL / Supabase
*
* DESCRIPCIÓN:
* Vistas utilizadas por Spring Boot y Angular.
****************************************************************************************/


-- ==========================================================
-- VISTA: VIAJES DISPONIBLES
-- ==========================================================

CREATE OR REPLACE VIEW vw_viajes_disponibles AS

SELECT

v.id_viaje,

r.id_ruta,

r.nombre AS ruta,

v.fecha_viaje,

p.hora_salida,

p.hora_llegada_estimada,

b.id_bus,

b.codigo AS codigo_bus,

b.placa,

b.capacidad_asientos,

COALESCE(

COUNT(res.id_reserva)

FILTER(

WHERE res.estado='RESERVADO'

),0

) reservados,

(

b.capacidad_asientos-

COALESCE(

COUNT(res.id_reserva)

FILTER(

WHERE res.estado='RESERVADO'

),0)

) disponibles,

v.estado

FROM viajes v

INNER JOIN programacion_viajes p

ON p.id_programacion=v.id_programacion

INNER JOIN rutas r

ON r.id_ruta=p.id_ruta

INNER JOIN buses b

ON b.id_bus=v.id_bus

LEFT JOIN reservas res

ON res.id_viaje=v.id_viaje

GROUP BY

v.id_viaje,

r.id_ruta,

r.nombre,

v.fecha_viaje,

p.hora_salida,

p.hora_llegada_estimada,

b.id_bus,

b.codigo,

b.placa,

b.capacidad_asientos,

v.estado;


-- ==========================================================
-- VISTA: MIS RESERVAS
-- ==========================================================

CREATE OR REPLACE VIEW vw_mis_reservas AS

SELECT

res.id_reserva,

al.id_alumno,

u.nombres,

u.apellidos,

r.nombre ruta,

v.fecha_viaje,

p.hora_salida,

pa.nombre paradero,

res.estado,

res.codigo_qr,

res.fecha_reserva,

res.fecha_abordaje

FROM reservas res

INNER JOIN alumnos al

ON al.id_alumno=res.id_alumno

INNER JOIN usuarios u

ON u.id_usuario=al.id_usuario

INNER JOIN viajes v

ON v.id_viaje=res.id_viaje

INNER JOIN programacion_viajes p

ON p.id_programacion=v.id_programacion

INNER JOIN rutas r

ON r.id_ruta=p.id_ruta

INNER JOIN paraderos pa

ON pa.id_paradero=res.id_paradero;


-- ==========================================================
-- VISTA: DASHBOARD
-- ==========================================================

CREATE OR REPLACE VIEW vw_dashboard AS

SELECT

COUNT(*)

FILTER(

WHERE estado='PROGRAMADO'

) programados,

COUNT(*)

FILTER(

WHERE estado='EN_CURSO'

) en_curso,

COUNT(*)

FILTER(

WHERE estado='FINALIZADO'

) finalizados,

COUNT(*)

FILTER(

WHERE estado='CANCELADO'

) cancelados,

(

SELECT COUNT(*)

FROM reservas

WHERE estado='RESERVADO'

)

reservas_activas,

(

SELECT COUNT(*)

FROM incidencias

WHERE estado='PENDIENTE'

)

incidencias_pendientes;



-- ==========================================================
-- VISTA: SEGUIMIENTO
-- ==========================================================

CREATE OR REPLACE VIEW vw_seguimiento AS

SELECT DISTINCT ON (ub.id_viaje)

v.id_viaje,

r.nombre ruta,

b.codigo codigo_bus,

b.placa,

u.nombres,

u.apellidos,

ub.latitud,

ub.longitud,

ub.velocidad,

ub.fecha_hora,

v.estado

FROM ubicacion_bus ub

INNER JOIN viajes v

ON v.id_viaje=ub.id_viaje

INNER JOIN buses b

ON b.id_bus=v.id_bus

INNER JOIN choferes c

ON c.id_chofer=v.id_chofer

INNER JOIN usuarios u

ON u.id_usuario=c.id_usuario

INNER JOIN programacion_viajes p

ON p.id_programacion=v.id_programacion

INNER JOIN rutas r

ON r.id_ruta=p.id_ruta

ORDER BY

ub.id_viaje,

ub.fecha_hora DESC;