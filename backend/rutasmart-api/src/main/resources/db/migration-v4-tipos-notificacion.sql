-- Tipos de notificación usados por la app (viajes, sanciones, etc.)
ALTER TABLE notificaciones DROP CONSTRAINT IF EXISTS chk_tipo_notificacion;
ALTER TABLE notificaciones ADD CONSTRAINT chk_tipo_notificacion CHECK (
    tipo IN ('RESERVA', 'RECORDATORIO', 'INCIDENCIA', 'SISTEMA', 'VIAJE', 'SANCION')
);
