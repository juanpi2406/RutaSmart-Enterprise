/****************************************************************************************
* PROYECTO : RutaSmart V2
* ARCHIVO  : 06_functions.sql
* MOTOR    : PostgreSQL / Supabase
*
* DESCRIPCIÓN:
* Funciones utilitarias del sistema.
*
****************************************************************************************/

-- ==========================================================
-- FUNCIÓN:
-- calcular_cupos()
-- ==========================================================

CREATE OR REPLACE FUNCTION calcular_cupos(

    p_id_viaje BIGINT

)

RETURNS INTEGER

LANGUAGE plpgsql

AS

$$

DECLARE

    v_capacidad INTEGER;

    v_reservados INTEGER;

BEGIN

    SELECT

        b.capacidad_asientos

    INTO

        v_capacidad

    FROM viajes v

    INNER JOIN buses b

    ON b.id_bus=v.id_bus

    WHERE v.id_viaje=p_id_viaje;

    SELECT

        COUNT(*)

    INTO

        v_reservados

    FROM reservas

    WHERE

        id_viaje=p_id_viaje

        AND estado='RESERVADO';

    RETURN

        v_capacidad-

        COALESCE(v_reservados,0);

END;

$$;



-- ==========================================================
-- FUNCIÓN:
-- generar_viajes()
-- ==========================================================

CREATE OR REPLACE FUNCTION generar_viajes(

    p_fecha_inicio DATE,

    p_fecha_fin DATE

)

RETURNS VOID

LANGUAGE plpgsql

AS

$$

DECLARE

    v_fecha DATE;

    v_programacion RECORD;

BEGIN

    v_fecha:=p_fecha_inicio;

    WHILE

        v_fecha<=p_fecha_fin

    LOOP

        FOR v_programacion IN

            SELECT

                id_programacion

            FROM

                programacion_viajes

            WHERE

                estado=TRUE

        LOOP

            INSERT INTO viajes(

                id_programacion,

                id_bus,

                id_chofer,

                fecha_viaje,

                estado

            )

            VALUES(

                v_programacion.id_programacion,

                1,

                1,

                v_fecha,

                'PROGRAMADO'

            );

        END LOOP;

        v_fecha:=v_fecha+1;

    END LOOP;

END;

$$;




/****************************************************************************************
* PROYECTO : RutaSmart V2
* ARCHIVO  : 06_functions.sql
* MOTOR    : PostgreSQL / Supabase
*
* FUNCIÓN:
* Genera los viajes según las programaciones y asignaciones vigentes.
****************************************************************************************/

CREATE OR REPLACE FUNCTION generar_viajes(

    p_fecha_inicio DATE,
    p_fecha_fin DATE

)

RETURNS VOID

LANGUAGE plpgsql

AS
$$

DECLARE

    v_fecha DATE;

    v_asignacion RECORD;

BEGIN

    v_fecha := p_fecha_inicio;

    WHILE v_fecha <= p_fecha_fin LOOP

        FOR v_asignacion IN

            SELECT

                ap.id_programacion,
                ap.id_bus,
                ap.id_chofer

            FROM asignacion_programacion ap

            WHERE ap.estado = TRUE

            AND ap.fecha_inicio <= v_fecha

            AND (
                    ap.fecha_fin IS NULL
                    OR
                    ap.fecha_fin >= v_fecha
                )

        LOOP

            INSERT INTO viajes(

                id_programacion,
                id_bus,
                id_chofer,
                fecha_viaje,
                estado

            )

            VALUES(

                v_asignacion.id_programacion,
                v_asignacion.id_bus,
                v_asignacion.id_chofer,
                v_fecha,
                'PROGRAMADO'

            );

        END LOOP;

        v_fecha := v_fecha + INTERVAL '1 day';

    END LOOP;

END;

$$;