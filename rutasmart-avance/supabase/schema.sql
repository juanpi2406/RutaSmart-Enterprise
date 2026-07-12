-- ============================================================
-- RutaSmart Enterprise - Esquema Supabase (Postgres)
-- Ejecuta este script en el SQL Editor de Supabase
-- (o deja que Spring Boot cree las tablas con ddl-auto=create)
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id          BIGSERIAL PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,
    correo      VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(150) NOT NULL,
    rol         VARCHAR(50)  NOT NULL,   -- ADMINISTRADOR | ALUMNO | CHOFER
    estado      VARCHAR(50)  NOT NULL,   -- ACTIVO | VACACIONES | INACTIVO
    dni         VARCHAR(20),
    licencia    VARCHAR(20),
    vencimiento VARCHAR(20),
    telefono    VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS buses (
    id      BIGSERIAL PRIMARY KEY,
    codigo  VARCHAR(20) NOT NULL,
    placa   VARCHAR(20),
    ruta    VARCHAR(80),
    chofer  VARCHAR(120),
    estado  VARCHAR(30)          -- DISPONIBLE | EN_RUTA | MANTENIMIENTO
);

CREATE TABLE IF NOT EXISTS reservas (
    id      BIGSERIAL PRIMARY KEY,
    alumno  VARCHAR(150),
    ruta    VARCHAR(50),         -- Norte | Sur | Centro
    fecha   VARCHAR(20),         -- YYYY-MM-DD
    hora    VARCHAR(10),         -- HH:mm
    estado  VARCHAR(30)          -- CONFIRMADA | PENDIENTE | CANCELADA
);

CREATE TABLE IF NOT EXISTS incidencias (
    id           BIGSERIAL PRIMARY KEY,
    tipo         VARCHAR(50),    -- Conductor | Bus | Ruta
    descripcion  TEXT,
    fecha        VARCHAR(20),
    estado       VARCHAR(30),    -- Activa | En revision | Resuelta
    reportado_por VARCHAR(120)
);

-- ============================================================
-- DATOS DE EJEMPLO (opcional: el backend tambien los siembra)
-- ============================================================

INSERT INTO usuarios (nombre, correo, password, rol, estado, dni, licencia, vencimiento, telefono) VALUES
    ('Juan Castillo', 'juan@rutasmart.pe', 'admin123',  'ADMINISTRADOR', 'ACTIVO',    NULL, NULL,      NULL,        NULL),
    ('Carlos Ruiz',   'carlos@univ.pe',     'alumno123', 'ALUMNO',        'ACTIVO',    NULL, NULL,      NULL,        NULL),
    ('María Soto',    'maria@univ.pe',      'alumno123', 'ALUMNO',        'ACTIVO',    NULL, NULL,      NULL,        NULL),
    ('José Díaz',     'jose@univ.pe',       'alumno123', 'ALUMNO',        'ACTIVO',    NULL, NULL,      NULL,        NULL),
    ('Miguel Díaz',   'miguel@ruta.pe',     'chofer123', 'CHOFER',        'VACACIONES',NULL, NULL,      NULL,        NULL),
    ('Pedro López',   'pedro@rutasmart.pe', 'chofer123', 'CHOFER',        'ACTIVO',    '74125896', 'A-IIIB', '2028-12-15', '999 888 777');

INSERT INTO buses (codigo, placa, ruta, chofer, estado) VALUES
    ('BUS-01', 'ABC-123', 'Ruta Norte', 'Carlos Ruiz', 'DISPONIBLE'),
    ('BUS-02', 'XYZ-852', 'Ruta Sur',   'Miguel Díaz', 'EN_RUTA'),
    ('BUS-03', 'AAA-456', 'Ruta Centro', 'Pedro León', 'MANTENIMIENTO');

INSERT INTO reservas (alumno, ruta, fecha, hora, estado) VALUES
    ('Carlos Ruiz', 'Norte', '2026-07-10', '07:00', 'CONFIRMADA'),
    ('María Soto',  'Centro', '2026-07-10', '08:00', 'PENDIENTE'),
    ('José Díaz',   'Sur',   '2026-07-10', '09:00', 'CONFIRMADA');

INSERT INTO incidencias (tipo, descripcion, fecha, estado, reportado_por) VALUES
    ('Bus', 'Retraso en salida programada - Ruta Norte', '2026-07-03', 'Activa', 'Supervisor'),
    ('Bus', 'Mal funcionamiento del aire acondicionado - BUS-01', '2026-07-01', 'Resuelta', 'Pedro López'),
    ('Ruta', 'Desvio de ruta por cierre de vía - Ruta Sur', '2026-06-28', 'Resuelta', 'Tráfico'),
    ('Conductor', 'Reclamo por exceso de velocidad', '2026-06-25', 'En revision', 'Pasajero');
