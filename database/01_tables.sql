/****************************************************************************************
* PROYECTO : RutaSmart V2
* ARCHIVO  : 01_tables.sql
* MOTOR    : PostgreSQL / Supabase
* AUTOR    : Juan Castillo
* DESCRIPCIÓN:
* Creación de las tablas principales del sistema.
*
* NOTA:
* Este archivo solamente crea las tablas.
* Las restricciones CHECK, UNIQUE e índices se crearán en los siguientes scripts.
****************************************************************************************/

-- ============================================================
-- TABLA: ROLES
-- ============================================================

CREATE TABLE roles (

    id_rol BIGSERIAL PRIMARY KEY,

    nombre VARCHAR(30) NOT NULL,

    descripcion VARCHAR(200),

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP

);

-- ============================================================
-- TABLA: USUARIOS
-- ============================================================

CREATE TABLE usuarios (

    id_usuario BIGSERIAL PRIMARY KEY,

    codigo VARCHAR(20) NOT NULL,

    nombres VARCHAR(100) NOT NULL,

    apellidos VARCHAR(100) NOT NULL,

    correo VARCHAR(120) NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    telefono VARCHAR(20),

    id_rol BIGINT NOT NULL,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    ultimo_login TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY(id_rol)
        REFERENCES roles(id_rol)

);

-- ============================================================
-- TABLA: ALUMNOS
-- ============================================================

CREATE TABLE alumnos (

    id_alumno BIGSERIAL PRIMARY KEY,

    id_usuario BIGINT NOT NULL,

    codigo_universitario VARCHAR(20),

    facultad VARCHAR(100),

    escuela VARCHAR(100),

    ciclo SMALLINT,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP,

    CONSTRAINT fk_alumno_usuario
        FOREIGN KEY(id_usuario)
        REFERENCES usuarios(id_usuario)

);

-- ============================================================
-- TABLA: CHOFERES
-- ============================================================

CREATE TABLE choferes (

    id_chofer BIGSERIAL PRIMARY KEY,

    id_usuario BIGINT NOT NULL,

    licencia VARCHAR(30) NOT NULL,

    categoria_licencia VARCHAR(10),

    fecha_vencimiento DATE,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP,

    CONSTRAINT fk_chofer_usuario
        FOREIGN KEY(id_usuario)
        REFERENCES usuarios(id_usuario)

);

-- ============================================================
-- TABLA: BUSES
-- ============================================================

CREATE TABLE buses (

    id_bus BIGSERIAL PRIMARY KEY,

    codigo VARCHAR(20) NOT NULL,

    placa VARCHAR(15) NOT NULL,

    marca VARCHAR(50) NOT NULL,

    modelo VARCHAR(50),

    anio SMALLINT,

    color VARCHAR(30),

    capacidad_asientos SMALLINT NOT NULL,

    observaciones TEXT,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP

);

-- ============================================================
-- TABLA: RUTAS
-- ============================================================

CREATE TABLE rutas (

    id_ruta BIGSERIAL PRIMARY KEY,

    codigo VARCHAR(20),

    nombre VARCHAR(120) NOT NULL,

    origen VARCHAR(120),

    destino VARCHAR(120),

    descripcion TEXT,

    distancia_km NUMERIC(6,2),

    tiempo_estimado_min SMALLINT,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP

);

-- ============================================================
-- TABLA: PARADEROS
-- ============================================================

CREATE TABLE paraderos (

    id_paradero BIGSERIAL PRIMARY KEY,

    id_ruta BIGINT NOT NULL,

    nombre VARCHAR(120) NOT NULL,

    direccion VARCHAR(250),

    latitud NUMERIC(10,8) NOT NULL,

    longitud NUMERIC(11,8) NOT NULL,

    orden SMALLINT NOT NULL,

    tiempo_estimado_min SMALLINT,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP,

    CONSTRAINT fk_paradero_ruta
        FOREIGN KEY(id_ruta)
        REFERENCES rutas(id_ruta)

);


-- ============================================================
-- TABLA: PROGRAMACION_VIAJES
-- ============================================================

CREATE TABLE programacion_viajes (

    id_programacion BIGSERIAL PRIMARY KEY,

    id_ruta BIGINT NOT NULL,

    hora_salida TIME NOT NULL,

    hora_llegada_estimada TIME NOT NULL,

    dias_operacion VARCHAR(100) NOT NULL,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP,

    CONSTRAINT fk_programacion_ruta
        FOREIGN KEY(id_ruta)
        REFERENCES rutas(id_ruta)

);



-- ============================================================
-- TABLA: VIAJES
-- ============================================================

CREATE TABLE viajes (

    id_viaje BIGSERIAL PRIMARY KEY,

    id_programacion BIGINT NOT NULL,

    id_bus BIGINT NOT NULL,

    id_chofer BIGINT NOT NULL,

    fecha_viaje DATE NOT NULL,

    hora_inicio_real TIMESTAMP,

    hora_fin_real TIMESTAMP,

    estado VARCHAR(20) NOT NULL,

    observaciones TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP,

    CONSTRAINT fk_viaje_programacion
        FOREIGN KEY(id_programacion)
        REFERENCES programacion_viajes(id_programacion),

    CONSTRAINT fk_viaje_bus
        FOREIGN KEY(id_bus)
        REFERENCES buses(id_bus),

    CONSTRAINT fk_viaje_chofer
        FOREIGN KEY(id_chofer)
        REFERENCES choferes(id_chofer)

);

-- ============================================================
-- TABLA: RESERVAS
-- ============================================================

CREATE TABLE reservas (

    id_reserva BIGSERIAL PRIMARY KEY,

    id_alumno BIGINT NOT NULL,

    id_viaje BIGINT NOT NULL,

    id_paradero BIGINT NOT NULL,

    fecha_reserva TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_abordaje TIMESTAMP,

    codigo_qr VARCHAR(100),

    estado VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP,

    CONSTRAINT fk_reserva_alumno
        FOREIGN KEY(id_alumno)
        REFERENCES alumnos(id_alumno),

    CONSTRAINT fk_reserva_viaje
        FOREIGN KEY(id_viaje)
        REFERENCES viajes(id_viaje),

    CONSTRAINT fk_reserva_paradero
        FOREIGN KEY(id_paradero)
        REFERENCES paraderos(id_paradero)

);

-- ============================================================
-- TABLA: UBICACION_BUS
-- ============================================================

CREATE TABLE ubicacion_bus (

    id_ubicacion BIGSERIAL PRIMARY KEY,

    id_viaje BIGINT NOT NULL,

    latitud NUMERIC(10,8) NOT NULL,

    longitud NUMERIC(11,8) NOT NULL,

    velocidad NUMERIC(5,2),

    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ubicacion_viaje
        FOREIGN KEY(id_viaje)
        REFERENCES viajes(id_viaje)

);

-- ============================================================
-- TABLA: INCIDENCIAS
-- ============================================================

CREATE TABLE incidencias (

    id_incidencia BIGSERIAL PRIMARY KEY,

    id_usuario BIGINT NOT NULL,

    id_viaje BIGINT,

    tipo VARCHAR(50) NOT NULL,

    descripcion TEXT NOT NULL,

    estado VARCHAR(20) NOT NULL,

    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_incidencia_usuario
        FOREIGN KEY(id_usuario)
        REFERENCES usuarios(id_usuario),

    CONSTRAINT fk_incidencia_viaje
        FOREIGN KEY(id_viaje)
        REFERENCES viajes(id_viaje)

);

-- ============================================================
-- TABLA: NOTIFICACIONES
-- ============================================================

CREATE TABLE notificaciones (

    id_notificacion BIGSERIAL PRIMARY KEY,

    id_usuario BIGINT NOT NULL,

    titulo VARCHAR(150) NOT NULL,

    mensaje TEXT NOT NULL,

    tipo VARCHAR(30),

    leido BOOLEAN NOT NULL DEFAULT FALSE,

    fecha_envio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notificacion_usuario
        FOREIGN KEY(id_usuario)
        REFERENCES usuarios(id_usuario)

);


CREATE TABLE asignacion_programacion (

    id_asignacion BIGSERIAL PRIMARY KEY,

    id_programacion BIGINT NOT NULL,

    id_bus BIGINT NOT NULL,

    id_chofer BIGINT NOT NULL,

    fecha_inicio DATE NOT NULL,

    fecha_fin DATE,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP

);



























