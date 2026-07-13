/****************************************************************************************
 * PROYECTO : RutaSmart V2
 * ARCHIVO  : 08_asientos.sql
 * MOTOR    : PostgreSQL / Supabase
 * AUTOR    : Juan Castillo
 * DESCRIPCIÓN:
 * Tabla de asientos por viaje y asignación de asiento por reserva.
 *
 * NOTA:
 * Este script depende de las tablas creadas en 01_tables.sql.
 ****************************************************************************************/

INSERT INTO usuarios
(codigo,nombres,apellidos,correo,password_hash,telefono,id_rol)
VALUES
(
'ADM001',
'Administrador',
'RutaSmart',
'admin@rutasmart.pe',
'$2a$10$HE.mWCUPTxiuCTdlqk.iD.IzCaU5dFvA.Lvl082P9AXVpdufZwCfC',
'999999999',
1
);



INSERT INTO usuarios
(codigo,nombres,apellidos,correo,password_hash,telefono,id_rol)
VALUES

('OP001','Luis','Ramirez','operador1@rutasmart.pe','$2a$10$HE.mWCUPTxiuCTdlqk.iD.IzCaU5dFvA.Lvl082P9AXVpdufZwCfC','999111111',4),

('OP002','Maria','Torres','operador2@rutasmart.pe','$2a$10$HE.mWCUPTxiuCTdlqk.iD.IzCaU5dFvA.Lvl082P9AXVpdufZwCfC','999111112',4);


INSERT INTO usuarios
(
codigo,
nombres,
apellidos,
correo,
password_hash,
telefono,
id_rol
)

SELECT

'CH'||LPAD(g::text,3,'0'),

'Chofer'||g,

'RutaSmart',

'chofer'||g||'@rutasmart.pe',

'$2a$10$HE.mWCUPTxiuCTdlqk.iD.IzCaU5dFvA.Lvl082P9AXVpdufZwCfC',

'981'||LPAD(g::text,6,'0'),

3

FROM generate_series(1,8) g;


INSERT INTO choferes
(
id_usuario,
licencia,
categoria_licencia,
fecha_vencimiento
)

SELECT

id_usuario,

'LIC-'||LPAD(id_usuario::text,5,'0'),

'AIIIC',

'2032-12-31'

FROM usuarios

WHERE id_rol=3;

INSERT INTO usuarios
(
codigo,
nombres,
apellidos,
correo,
password_hash,
telefono,
id_rol
)

SELECT

'AL'||LPAD(g::text,3,'0'),

'Alumno'||g,

'RutaSmart',

'alumno'||g||'@utp.edu.pe',

'$2a$10$HE.mWCUPTxiuCTdlqk.iD.IzCaU5dFvA.Lvl082P9AXVpdufZwCfC',

'982'||LPAD(g::text,6,'0'),

2

FROM generate_series(1,50) g;

INSERT INTO alumnos
(
id_usuario,
codigo_universitario,
facultad,
sede,
ciclo
)

SELECT

id_usuario,

'2025'||LPAD(id_usuario::text,6,'0'),

CASE

WHEN id_usuario%4=0 THEN 'Ingeniería'

WHEN id_usuario%4=1 THEN 'Arquitectura'

WHEN id_usuario%4=2 THEN 'Negocios'

ELSE 'Salud'

END,

CASE

WHEN id_usuario%3=0 THEN 'Lima Centro'

WHEN id_usuario%3=1 THEN 'Lima Norte'

ELSE 'Lima Sur'

END,

((id_usuario%10)+1)

FROM usuarios

WHERE id_rol=2;


INSERT INTO buses
(
codigo,
placa,
marca,
modelo,
anio,
color,
capacidad_asientos
)

VALUES

('BUS001','ABC101','Mercedes Benz','OF1721',2024,'Blanco',45),

('BUS002','ABC102','Mercedes Benz','OF1721',2024,'Azul',45),

('BUS003','ABC103','Volvo','9800',2025,'Rojo',40),

('BUS004','ABC104','Scania','K310',2025,'Gris',40),

('BUS005','ABC105','Volvo','9700',2025,'Negro',35),

('BUS006','ABC106','Mercedes Benz','OF1721',2024,'Plateado',35),

('BUS007','ABC107','Scania','K360',2025,'Blanco',30),

('BUS008','ABC108','Volvo','9800',2025,'Azul',25);



INSERT INTO rutas
(
codigo,
nombre,
origen,
destino,
descripcion,
distancia_km,
tiempo_estimado_min
)

VALUES

('R001','Lima Norte','Los Olivos','UTP Lima Norte','Ruta Norte',18.50,45),

('R002','Lima Sur','Villa El Salvador','UTP Ate','Ruta Sur',22.80,60),

('R003','Lima Este','Santa Anita','UTP Ate','Ruta Este',16.40,40),

('R004','Lima Centro','Centro de Lima','UTP Centro','Ruta Centro',14.20,35),

('R005','Callao','Callao','UTP Lima Centro','Ruta Callao',27.50,70);





INSERT INTO paraderos
(
id_ruta,
nombre,
direccion,
latitud,
longitud,
orden,
tiempo_estimado_min
)

SELECT

r.id_ruta,

'Paradero '||g||' - '||r.nombre,

'Av. Principal '||g,

-12.000000+(g*0.010),

-77.000000+(g*0.010),

g,

g*5

FROM rutas r

CROSS JOIN generate_series(1,10) g;



INSERT INTO programacion_viajes
(
id_ruta,
hora_salida,
hora_llegada_estimada,
dias_operacion
)

SELECT

r.id_ruta,

h,

h + interval '45 minutes',

'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES'

FROM rutas r

CROSS JOIN
(
VALUES

(time '16:00'),

(time '17:00'),

(time '18:00'),

(time '19:00'),

(time '20:00'),

(time '21:00'),

(time '22:00'),

(time '23:00')

) horario(h);




WITH datos AS
(
SELECT

id_programacion,

ROW_NUMBER() OVER(ORDER BY id_programacion) fila

FROM programacion_viajes
)

INSERT INTO asignacion_programacion
(
id_programacion,
id_bus,
id_chofer,
fecha_inicio,
estado
)

SELECT

d.id_programacion,

((d.fila-1)%8)+1,

((d.fila-1)%8)+1,

CURRENT_DATE,

TRUE

FROM datos d;