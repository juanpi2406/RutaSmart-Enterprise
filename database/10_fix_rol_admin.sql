/****************************************************************************************
* PROYECTO : RutaSmart V2
* ARCHIVO  : 10_fix_rol_admin.sql
* MOTOR    : PostgreSQL / Supabase
*
* DESCRIPCIÓN:
* El frontend (menu.ts, usuarios.ts) y los guards de rol usan el literal 'ADMINISTRADOR',
* pero el seed original insertó el rol como 'ADMIN'. Se unifica al valor usado por el
* frontend para que el control de acceso por rol funcione correctamente.
****************************************************************************************/

UPDATE roles
SET nombre = 'ADMINISTRADOR'
WHERE nombre = 'ADMIN';
