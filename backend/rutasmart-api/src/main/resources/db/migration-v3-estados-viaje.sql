-- Ampliar estados válidos de viaje (EN_RUTA / COMPLETADO usados en la app)
ALTER TABLE viajes DROP CONSTRAINT IF EXISTS chk_estado_viaje;
ALTER TABLE viajes ADD CONSTRAINT chk_estado_viaje CHECK (
    estado IN ('PROGRAMADO', 'EN_CURSO', 'EN_RUTA', 'FINALIZADO', 'COMPLETADO', 'CANCELADO')
);
