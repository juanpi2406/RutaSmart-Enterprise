/****************************************************************************************
* PROYECTO : RutaSmart V2
* ARCHIVO  : 04_seed.sql
* MOTOR    : PostgreSQL / Supabase
*
* Datos iniciales del sistema.
*
* NOTA:
* La contraseña del administrador será reemplazada por BCrypt
* cuando implementemos Spring Security.
****************************************************************************************/

INSERT INTO roles
(nombre, descripcion)
VALUES

('ADMINISTRADOR','Administrador del sistema'),

('ALUMNO','Estudiante'),

('CHOFER','Conductor'),

('OPERADOR','Operador de monitoreo');


INSERT INTO usuarios(

codigo,

nombres,

apellidos,

correo,

password_hash,

telefono,

id_rol

)

VALUES(

'ADM001',

'Administrador',

'RutaSmart',

'admin@rutasmart.pe',

'CAMBIAR_POR_BCRYPT',

'999999999',

1

);

INSERT INTO usuarios(

codigo,

nombres,

apellidos,

correo,

password_hash,

telefono,

id_rol

)

VALUES(

'CH001',

'Juan',

'Perez',

'chofer@rutasmart.pe',

'CAMBIAR_POR_BCRYPT',

'999888777',

3

);

INSERT INTO choferes(

id_usuario,

licencia,

categoria_licencia,

fecha_vencimiento

)

VALUES(

2,

'AIIIC',

'III-C',

'2030-12-31'

);

INSERT INTO usuarios(

codigo,

nombres,

apellidos,

correo,

password_hash,

telefono,

id_rol

)

VALUES(

'AL001',

'Carlos',

'Lopez',

'alumno@utp.edu.pe',

'CAMBIAR_POR_BCRYPT',

'988777666',

2

);

INSERT INTO alumnos(

id_usuario,

codigo_universitario,

facultad,

escuela,

ciclo

)

VALUES(

3,

'2020123456',

'Ingeniería',

'Sistemas',

7

);

INSERT INTO buses(

codigo,

placa,

marca,

modelo,

anio,

color,

capacidad_asientos

)

VALUES(

'BUS01',

'ABC123',

'Mercedes Benz',

'OF1721',

2024,

'Blanco',

45

);



INSERT INTO rutas(

codigo,

nombre,

origen,

destino,

descripcion,

distancia_km,

tiempo_estimado_min

)

VALUES(

'R001',

'Lima Sur',

'Puente Alipio',

'UTP Villa',

'Ruta principal',

18.60,

45

);

INSERT INTO paraderos
(id_ruta,nombre,direccion,latitud,longitud,orden)

VALUES

(1,'Puente Alipio','Puente Alipio',-12.154000,-76.989000,1),

(1,'Atocongo','Av. Los Héroes',-12.160000,-76.990000,2),

(1,'Mall del Sur','Mall del Sur',-12.170000,-76.995000,3),

(1,'Óvalo Higuereta','Óvalo Higuereta',-12.128000,-76.990000,4),

(1,'Benavides','Av. Benavides',-12.135000,-77.001000,5),

(1,'Primavera','Av. Primavera',-12.110000,-76.980000,6),

(1,'Javier Prado','Av. Javier Prado',-12.090000,-76.970000,7),

(1,'Canadá','Av. Canadá',-12.080000,-76.960000,8),

(1,'Circunvalación','Av. Circunvalación',-12.070000,-76.950000,9),

(1,'UTP Villa','Campus UTP',-12.197000,-76.968000,10);



INSERT INTO programacion_viajes(

id_ruta,

hora_salida,

hora_llegada_estimada,

dias_operacion

)

VALUES

(1,'16:00','16:45','LUNES,MARTES,MIERCOLES,JUEVES,VIERNES'),

(1,'17:00','17:45','LUNES,MARTES,MIERCOLES,JUEVES,VIERNES'),

(1,'18:00','18:45','LUNES,MARTES,MIERCOLES,JUEVES,VIERNES'),

(1,'19:00','19:45','LUNES,MARTES,MIERCOLES,JUEVES,VIERNES'),

(1,'20:00','20:45','LUNES,MARTES,MIERCOLES,JUEVES,VIERNES'),

(1,'21:00','21:45','LUNES,MARTES,MIERCOLES,JUEVES,VIERNES'),

(1,'22:00','22:45','LUNES,MARTES,MIERCOLES,JUEVES,VIERNES'),

(1,'23:00','23:45','LUNES,MARTES,MIERCOLES,JUEVES,VIERNES');



INSERT INTO viajes(

id_programacion,

id_bus,

id_chofer,

fecha_viaje,

estado

)

SELECT

id_programacion,

1,

1,

CURRENT_DATE,

'PROGRAMADO'

FROM programacion_viajes;



INSERT INTO asignacion_programacion
(
    id_programacion,
    id_bus,
    id_chofer,
    fecha_inicio
)
SELECT
    id_programacion,
    1,
    1,
    CURRENT_DATE
FROM programacion_viajes;