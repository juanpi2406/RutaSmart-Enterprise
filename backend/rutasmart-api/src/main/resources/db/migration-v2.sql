-- OPCIONAL: solo si quieres persistir sede, cache de mapas o geo en incidencias.
-- No crea tablas nuevas, solo columnas en tablas existentes.
ALTER TABLE rutas ADD COLUMN IF NOT EXISTS sede VARCHAR(100);
ALTER TABLE rutas ADD COLUMN IF NOT EXISTS geometria_cache TEXT;

ALTER TABLE incidencias ADD COLUMN IF NOT EXISTS latitud DECIMAL(10,8);
ALTER TABLE incidencias ADD COLUMN IF NOT EXISTS longitud DECIMAL(11,8);

-- reservas.codigo_qr y fecha_abordaje ya existen en el modelo JPA

UPDATE rutas SET sede = 'Lima Sur' WHERE sede IS NULL;
