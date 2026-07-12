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

-- ============================================================
-- TABLA: ASIENTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS asientos (
    id_asiento BIGSERIAL PRIMARY KEY,
    id_viaje BIGINT NOT NULL,
    numero_asiento SMALLINT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_asiento_viaje
        FOREIGN KEY(id_viaje)
        REFERENCES viajes(id_viaje),
    CONSTRAINT uq_asiento_viaje_numero
        UNIQUE(id_viaje, numero_asiento)
);

-- ============================================================
-- TABLA: ASIENTOS - CHECK
-- ============================================================

ALTER TABLE asientos
    ADD CONSTRAINT chk_numero_asiento_positivo
    CHECK (numero_asiento > 0);

-- ============================================================
-- RESERVAS - AGREGAR NUMERO_ASIENTO
-- ============================================================

ALTER TABLE reservas
    ADD COLUMN IF NOT EXISTS numero_asiento SMALLINT;
