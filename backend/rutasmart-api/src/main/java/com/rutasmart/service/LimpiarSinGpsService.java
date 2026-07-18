package com.rutasmart.service;

import com.rutasmart.dto.LimpiezaSinGpsDTO;
import com.rutasmart.dto.RutaGeometriaDTO;
import com.rutasmart.entity.ProgramacionViaje;
import com.rutasmart.entity.Ruta;
import com.rutasmart.repository.ProgramacionViajeRepository;
import com.rutasmart.repository.RutaRepository;
import com.rutasmart.repository.ViajeRepository;
import com.rutasmart.service.interfaces.RutaGeometriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LimpiarSinGpsService {

    private final RutaRepository rutaRepository;
    private final ProgramacionViajeRepository programacionRepository;
    private final ViajeRepository viajeRepository;
    private final RutaGeometriaService rutaGeometriaService;
    private final DependenciasEliminacionService dependenciasEliminacionService;

    @Transactional
    public LimpiezaSinGpsDTO limpiar() {
        List<Ruta> candidatas = new ArrayList<>();
        int viajesAntes = 0;
        int programacionesAntes = 0;

        for (Ruta ruta : rutaRepository.findAll()) {
            RutaGeometriaDTO geo = rutaGeometriaService.obtenerGeometria(ruta.getIdRuta());
            if (!geo.isMapeable()) {
                List<ProgramacionViaje> programaciones = programacionRepository.findByRuta(ruta);
                programacionesAntes += programaciones.size();
                for (ProgramacionViaje programacion : programaciones) {
                    viajesAntes += viajeRepository.findByProgramacion_IdProgramacion(
                            programacion.getIdProgramacion()).size();
                }
                candidatas.add(ruta);
            }
        }

        List<String> eliminadas = new ArrayList<>();
        for (Ruta ruta : candidatas) {
            eliminadas.add(ruta.getCodigo() + " — " + ruta.getNombre());
            dependenciasEliminacionService.eliminarDependenciasRuta(ruta);
            rutaRepository.delete(ruta);
            rutaGeometriaService.invalidarCache(ruta.getIdRuta());
        }

        String mensaje = candidatas.isEmpty()
                ? "No hay rutas sin GPS. Todas tienen al menos 2 paraderos con coordenadas."
                : "Se eliminaron rutas sin GPS junto con sus programaciones, viajes y asignaciones.";

        return LimpiezaSinGpsDTO.builder()
                .rutasEliminadas(candidatas.size())
                .programacionesEliminadas(programacionesAntes)
                .viajesEliminados(viajesAntes)
                .rutas(eliminadas)
                .mensaje(mensaje)
                .build();
    }
}
