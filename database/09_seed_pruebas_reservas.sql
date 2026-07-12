/****************************************************************************************
 * PROYECTO : RutaSmart V2
 * ARCHIVO  : 09_seed_pruebas_reservas.sql
 * MOTOR    : PostgreSQL / Supabase
 ****************************************************************************************/

-- ============================================================
-- ROLES
-- ============================================================

INSERT INTO roles (nombre, descripcion)
SELECT 'ADMIN','Administrador'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'ADMIN');

INSERT INTO roles (nombre, descripcion)
SELECT 'ALUMNO','Estudiante'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'ALUMNO');

INSERT INTO roles (nombre, descripcion)
SELECT 'CHOFER','Conductor'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'CHOFER');

-- ============================================================
-- RUTA BASE
-- ============================================================

INSERT INTO rutas (codigo, nombre, origen, destino, descripcion, distancia_km, tiempo_estimado_min)
SELECT 'R001', 'Lima Sur', 'Puente Alipio', 'UTP Villa', 'Ruta principal', 18.60, 45
WHERE NOT EXISTS (SELECT 1 FROM rutas WHERE codigo = 'R001');

-- ============================================================
-- BUSES BASE
-- ============================================================

INSERT INTO buses (codigo, placa, marca, modelo, anio, color, capacidad_asientos)
VALUES
    ('BUS01', 'ABC123', 'Mercedes Benz', 'OF1721', 2024, 'Blanco', 40),
    ('BUS02', 'XYZ789', 'Volvo', 'B380R', 2023, 'Azul', 40)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================
-- USUARIOS BASE
-- ============================================================

INSERT INTO usuarios (codigo, nombres, apellidos, correo, password_hash, telefono, id_rol)
SELECT 'ADM001', 'Administrador', 'RutaSmart', 'admin@rutasmart.pe', 'CAMBIAR_POR_BCRYPT', '999999999', r.id_rol
FROM roles r
WHERE r.nombre = 'ADMIN'
  AND NOT EXISTS (SELECT 1 FROM usuarios WHERE codigo = 'ADM001');

INSERT INTO usuarios (codigo, nombres, apellidos, correo, password_hash, telefono, id_rol)
SELECT 'CHF01', 'Juan', 'Pérez', 'chofer@rutasmart.pe', 'CAMBIAR_POR_BCRYPT', '999888777', r.id_rol
FROM roles r
WHERE r.nombre = 'CHOFER'
  AND NOT EXISTS (SELECT 1 FROM usuarios WHERE codigo = 'CHF01');

INSERT INTO usuarios (codigo, nombres, apellidos, correo, password_hash, telefono, id_rol)
SELECT 'ALU01', 'Carlos', 'López', 'alumno@utp.edu.pe', 'CAMBIAR_POR_BCRYPT', '988777666', r.id_rol
FROM roles r
WHERE r.nombre = 'ALUMNO'
  AND NOT EXISTS (SELECT 1 FROM usuarios WHERE codigo = 'ALU01');

-- ============================================================
-- CHOFER / ALUMNO
-- ============================================================

INSERT INTO choferes (id_usuario, licencia, categoria_licencia, fecha_vencimiento)
SELECT u.id_usuario, 'AIIIC', 'III-C', '2030-12-31'
FROM usuarios u
WHERE u.codigo = 'CHF01'
  AND NOT EXISTS (SELECT 1 FROM choferes WHERE id_chofer = 1);

INSERT INTO alumnos (id_usuario, codigo_universitario, facultad, sede, ciclo)
SELECT u.id_usuario, '2020123456', 'Ingeniería', 'Sistemas', 7
FROM usuarios u
WHERE u.codigo = 'ALU01'
  AND NOT EXISTS (SELECT 1 FROM alumnos WHERE id_alumno = 1);

-- ============================================================
-- PROGRAMACIONES (por código de ruta)
-- ============================================================

INSERT INTO programacion_viajes (id_ruta, hora_salida, hora_llegada_estimada, dias_operacion, estado)
SELECT r.id_ruta, '06:00', '06:45', 'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES', true
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM programacion_viajes WHERE id_programacion = 1);

INSERT INTO programacion_viajes (id_ruta, hora_salida, hora_llegada_estimada, dias_operacion, estado)
SELECT r.id_ruta, '07:00', '07:45', 'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES', true
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM programacion_viajes WHERE id_programacion = 2);

INSERT INTO programacion_viajes (id_ruta, hora_salida, hora_llegada_estimada, dias_operacion, estado)
SELECT r.id_ruta, '08:00', '08:45', 'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES', true
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM programacion_viajes WHERE id_programacion = 3);

INSERT INTO programacion_viajes (id_ruta, hora_salida, hora_llegada_estimada, dias_operacion, estado)
SELECT r.id_ruta, '17:00', '17:45', 'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES', true
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM programacion_viajes WHERE id_programacion = 4);

INSERT INTO programacion_viajes (id_ruta, hora_salida, hora_llegada_estimada, dias_operacion, estado)
SELECT r.id_ruta, '18:00', '18:45', 'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES', true
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM programacion_viajes WHERE id_programacion = 5);

-- ============================================================
-- VIAJES
-- ============================================================

INSERT INTO viajes (id_programacion, id_bus, id_chofer, fecha_viaje, estado, observaciones)
SELECT pv.id_programacion, b.id_bus, c.id_chofer, CURRENT_DATE, 'PROGRAMADO', 'Viaje matutino de prueba'
FROM programacion_viajes pv
CROSS JOIN buses b
CROSS JOIN choferes c
WHERE pv.id_programacion = 1
  AND b.codigo = 'BUS01'
  AND c.id_chofer = 1
  AND NOT EXISTS (SELECT 1 FROM viajes WHERE id_viaje = 1);

INSERT INTO viajes (id_programacion, id_bus, id_chofer, fecha_viaje, estado, observaciones)
SELECT pv.id_programacion, b.id_bus, c.id_chofer, CURRENT_DATE + INTERVAL '1 day', 'PROGRAMADO', 'Viaje matutino de prueba 2'
FROM programacion_viajes pv
CROSS JOIN buses b
CROSS JOIN choferes c
WHERE pv.id_programacion = 2
  AND b.codigo = 'BUS01'
  AND c.id_chofer = 1
  AND NOT EXISTS (SELECT 1 FROM viajes WHERE id_viaje = 2);

INSERT INTO viajes (id_programacion, id_bus, id_chofer, fecha_viaje, estado, observaciones)
SELECT pv.id_programacion, b.id_bus, c.id_chofer, CURRENT_DATE + INTERVAL '2 day', 'PROGRAMADO', 'Viaje nocturno de prueba'
FROM programacion_viajes pv
CROSS JOIN buses b
CROSS JOIN choferes c
WHERE pv.id_programacion = 4
  AND b.codigo = 'BUS02'
  AND c.id_chofer = 1
  AND NOT EXISTS (SELECT 1 FROM viajes WHERE id_viaje = 3);

-- ============================================================
-- PARADEROS (resueltos por código de ruta)
-- ============================================================

INSERT INTO paraderos (id_ruta, nombre, direccion, latitud, longitud, orden)
SELECT r.id_ruta, 'Puente Alipio', 'Puente Alipio', -12.154000, -76.989000, 1
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM paraderos WHERE nombre = 'Puente Alipio');

INSERT INTO paraderos (id_ruta, nombre, direccion, latitud, longitud, orden)
SELECT r.id_ruta, 'Atocongo', 'Av. Los Héroes', -12.160000, -76.990000, 2
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM paraderos WHERE nombre = 'Atocongo');

INSERT INTO paraderos (id_ruta, nombre, direccion, latitud, longitud, orden)
SELECT r.id_ruta, 'Mall del Sur', 'Mall del Sur', -12.170000, -76.995000, 3
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM paraderos WHERE nombre = 'Mall del Sur');

INSERT INTO paraderos (id_ruta, nombre, direccion, latitud, longitud, orden)
SELECT r.id_ruta, 'Óvalo Higuereta', 'Óvalo Higuereta', -12.128000, -76.990000, 4
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM paraderos WHERE nombre = 'Óvalo Higuereta');

INSERT INTO paraderos (id_ruta, nombre, direccion, latitud, longitud, orden)
SELECT r.id_ruta, 'Benavides', 'Av. Benavides', -12.135000, -77.001000, 5
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM paraderos WHERE nombre = 'Benavides');

INSERT INTO paraderos (id_ruta, nombre, direccion, latitud, longitud, orden)
SELECT r.id_ruta, 'Primavera', 'Av. Primavera', -12.110000, -76.980000, 6
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM paraderos WHERE nombre = 'Primavera');

INSERT INTO paraderos (id_ruta, nombre, direccion, latitud, longitud, orden)
SELECT r.id_ruta, 'Javier Prado', 'Av. Javier Prado', -12.090000, -76.970000, 7
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM paraderos WHERE nombre = 'Javier Prado');

INSERT INTO paraderos (id_ruta, nombre, direccion, latitud, longitud, orden)
SELECT r.id_ruta, 'Canadá', 'Av. Canadá', -12.080000, -76.960000, 8
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM paraderos WHERE nombre = 'Canadá');

INSERT INTO paraderos (id_ruta, nombre, direccion, latitud, longitud, orden)
SELECT r.id_ruta, 'Circunvalación', 'Av. Circunvalación', -12.070000, -76.950000, 9
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM paraderos WHERE nombre = 'Circunvalación');

INSERT INTO paraderos (id_ruta, nombre, direccion, latitud, longitud, orden)
SELECT r.id_ruta, 'UTP Villa', 'Campus UTP', -12.197000, -76.968000, 10
FROM rutas r
WHERE r.codigo = 'R001'
  AND NOT EXISTS (SELECT 1 FROM paraderos WHERE nombre = 'UTP Villa');

-- ============================================================
-- ASIENTOS POR VIAJE
-- ============================================================

DO $$
DECLARE
    v_id_viaje_1 BIGINT;
    v_id_viaje_2 BIGINT;
    v_id_viaje_3 BIGINT;
BEGIN
    SELECT id_viaje INTO v_id_viaje_1 FROM viajes WHERE id_viaje = 1;
    SELECT id_viaje INTO v_id_viaje_2 FROM viajes WHERE id_viaje = 2;
    SELECT id_viaje INTO v_id_viaje_3 FROM viajes WHERE id_viaje = 3;

    IF v_id_viaje_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM asientos WHERE id_viaje = v_id_viaje_1) THEN
        INSERT INTO asientos (id_viaje, numero_asiento, estado)
        SELECT v_id_viaje_1, generate_series, true
        FROM generate_series(1, 40);
        UPDATE asientos SET estado = false
        WHERE id_viaje = v_id_viaje_1 AND numero_asiento IN (1, 2, 3, 4, 5);
    END IF;

    IF v_id_viaje_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM asientos WHERE id_viaje = v_id_viaje_2) THEN
        INSERT INTO asientos (id_viaje, numero_asiento, estado)
        SELECT v_id_viaje_2, generate_series, true
        FROM generate_series(1, 40);
        UPDATE asientos SET estado = false
        WHERE id_viaje = v_id_viaje_2 AND numero_asiento IN (10, 20);
    END IF;

    IF v_id_viaje_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM asientos WHERE id_viaje = v_id_viaje_3) THEN
        INSERT INTO asientos (id_viaje, numero_asiento, estado)
        SELECT v_id_viaje_3, generate_series, true
        FROM generate_series(1, 40);
    END IF;
END $$;

-- ============================================================
-- RESERVAS DE PRUEBA
-- ============================================================

INSERT INTO reservas (
    id_alumno,
    id_viaje,
    id_paradero,
    fecha_abordaje,
    estado,
    numero_asiento,
    codigo_qr
)
SELECT 1, v.id_viaje, 1, CURRENT_DATE + INTERVAL '7 hour', 'CONFIRMADA', 1, 'QR-AL001-V1'
FROM viajes v
WHERE v.id_viaje = 1
  AND NOT EXISTS (SELECT 1 FROM reservas WHERE codigo_qr = 'QR-AL001-V1');

INSERT INTO reservas (
    id_alumno,
    id_viaje,
    id_paradero,
    fecha_abordaje,
    estado,
    numero_asiento,
    codigo_qr
)
SELECT 1, v.id_viaje, 1, CURRENT_DATE + INTERVAL '7 hour', 'CONFIRMADA', 2, 'QR-AL001-V1-B'
FROM viajes v
WHERE v.id_viaje = 1
  AND NOT EXISTS (SELECT 1 FROM reservas WHERE codigo_qr = 'QR-AL001-V1-B');

INSERT INTO reservas (
    id_alumno,
    id_viaje,
    id_paradero,
    fecha_abordaje,
    estado,
    numero_asiento,
    codigo_qr
)
SELECT 1, v.id_viaje, 1, CURRENT_DATE + INTERVAL '7 hour', 'CONFIRMADA', 3, 'QR-AL001-V1-C'
FROM viajes v
WHERE v.id_viaje = 1
  AND NOT EXISTS (SELECT 1 FROM reservas WHERE codigo_qr = 'QR-AL001-V1-C');

INSERT INTO reservas (
    id_alumno,
    id_viaje,
    id_paradero,
    fecha_abordaje,
    estado,
    numero_asiento,
    codigo_qr
)
SELECT 1, v.id_viaje, 1, CURRENT_DATE + INTERVAL '7 hour', 'PENDIENTE', 4, 'QR-AL001-V1-D'
FROM viajes v
WHERE v.id_viaje = 1
  AND NOT EXISTS (SELECT 1 FROM reservas WHERE codigo_qr = 'QR-AL001-V1-D');

INSERT INTO reservas (
    id_alumno,
    id_viaje,
    id_paradero,
    fecha_abordaje,
    estado,
    numero_asiento,
    codigo_qr
)
SELECT 1, v.id_viaje, 5, CURRENT_DATE + INTERVAL '1 day' + INTERVAL '7 hour', 'CONFIRMADA', 10, 'QR-AL001-V2'
FROM viajes v
WHERE v.id_viaje = 2
  AND NOT EXISTS (SELECT 1 FROM reservas WHERE codigo_qr = 'QR-AL001-V2');
