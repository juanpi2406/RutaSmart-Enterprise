/****************************************************************************************
* PROYECTO : RutaSmart V2
* ARCHIVO  : 07_test_data.sql
*
* DESCRIPCIÓN:
* Genera datos de prueba para el sistema.
****************************************************************************************/

SELECT generar_viajes(

CURRENT_DATE,

CURRENT_DATE + INTERVAL '30 days'

);



/* generar reservas aleatorias*/

DO
$$

DECLARE

    v_alumno RECORD;

    v_viaje RECORD;

BEGIN

    FOR v_alumno IN

        SELECT id_alumno

        FROM alumnos

    LOOP

        FOR v_viaje IN

            SELECT id_viaje

            FROM viajes

            ORDER BY RANDOM()

            LIMIT 5

        LOOP

            INSERT INTO reservas(

                id_alumno,

                id_viaje,

                id_paradero,

                estado

            )

            VALUES(

                v_alumno.id_alumno,

                v_viaje.id_viaje,

                1,

                'RESERVADO'

            )

            ON CONFLICT DO NOTHING;

        END LOOP;

    END LOOP;

END;

$$;


/*genera ubicaciones aleatorias*/


DO
$$

DECLARE

    v_viaje RECORD;

    i INTEGER;

BEGIN

    FOR v_viaje IN

        SELECT id_viaje

        FROM viajes

    LOOP

        FOR i IN 1..20 LOOP

            INSERT INTO ubicacion_bus(

                id_viaje,

                latitud,

                longitud,

                velocidad

            )

            VALUES(

                v_viaje.id_viaje,

                -12.100000 + RANDOM()/100,

                -76.980000 + RANDOM()/100,

                ROUND((20 + RANDOM()*40)::NUMERIC,2)

            );

        END LOOP;

    END LOOP;

END;

$$;



/* crear incidencias   */


INSERT INTO incidencias(

id_usuario,

id_viaje,

tipo,

descripcion,

estado

)

SELECT

2,

id_viaje,

'TRAFICO',

'Congestión vehicular.',

'PENDIENTE'

FROM viajes

ORDER BY RANDOM()

LIMIT 15;


/*crear notificaciones*/




INSERT INTO notificaciones(

id_usuario,

titulo,

mensaje,

tipo

)

SELECT

3,

'Reserva Confirmada',

'Su reserva fue creada correctamente.',

'RESERVA'

FROM generate_series(1,20);



