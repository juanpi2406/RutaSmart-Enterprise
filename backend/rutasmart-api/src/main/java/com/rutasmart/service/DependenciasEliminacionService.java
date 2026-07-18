package com.rutasmart.service;

import com.rutasmart.entity.ProgramacionViaje;
import com.rutasmart.entity.Ruta;
import com.rutasmart.entity.Viaje;
import com.rutasmart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DependenciasEliminacionService {

    private final ParaderoRepository paraderoRepository;
    private final ProgramacionViajeRepository programacionRepository;
    private final AsignacionProgramacionRepository asignacionRepository;
    private final ViajeRepository viajeRepository;
    private final ReservaRepository reservaRepository;
    private final UbicacionBusRepository ubicacionBusRepository;
    private final IncidenciaRepository incidenciaRepository;
    private final AsientoRepository asientoRepository;

    @Transactional
    public void eliminarDependenciasViaje(Viaje viaje) {
        if (viaje == null || viaje.getIdViaje() == null) return;
        eliminarDependenciasViaje(viaje.getIdViaje());
    }

    @Transactional
    public void eliminarDependenciasViaje(Long idViaje) {
        if (idViaje == null) return;

        reservaRepository.deleteAllByViajeId(idViaje);
        ubicacionBusRepository.deleteAllByViajeId(idViaje);
        incidenciaRepository.deleteAllByViajeId(idViaje);
        asientoRepository.deleteAllByViajeId(idViaje);
        viajeRepository.deleteById(idViaje);
    }

    @Transactional
    public void eliminarDependenciasProgramacion(ProgramacionViaje programacion) {
        if (programacion == null || programacion.getIdProgramacion() == null) return;

        Long idProgramacion = programacion.getIdProgramacion();

        // Borrado masivo por programación (evita miles de DELETE individuales)
        reservaRepository.deleteAllByProgramacionId(idProgramacion);
        ubicacionBusRepository.deleteAllByProgramacionId(idProgramacion);
        incidenciaRepository.deleteAllByProgramacionId(idProgramacion);
        asientoRepository.deleteAllByProgramacionId(idProgramacion);
        viajeRepository.deleteAllByProgramacionId(idProgramacion);
        asignacionRepository.deleteAllByProgramacionId(idProgramacion);
    }

    @Transactional
    public void eliminarDependenciasRuta(Ruta ruta) {
        if (ruta == null) return;

        List<ProgramacionViaje> programaciones = new ArrayList<>(
                programacionRepository.findByRuta(ruta)
        );

        for (ProgramacionViaje programacion : programaciones) {
            eliminarDependenciasProgramacion(programacion);
            programacionRepository.delete(programacion);
        }

        // Paraderos al final: las reservas ya fueron eliminadas con los viajes
        paraderoRepository.findByRutaOrderByOrdenAsc(ruta)
                .forEach(paraderoRepository::delete);
    }
}
