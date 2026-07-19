package com.rutasmart.service.impl;

import com.rutasmart.dto.ViajeDTO;
import com.rutasmart.entity.*;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.ViajeMapper;
import com.rutasmart.repository.*;
import com.rutasmart.service.AsistenciaReservaService;
import com.rutasmart.service.interfaces.NotificacionService;
import com.rutasmart.service.interfaces.ViajeService;
import com.rutasmart.service.DependenciasEliminacionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
@Slf4j
public class ViajeServiceImpl implements ViajeService {

    private static final Map<DayOfWeek, String> DIAS_ES = new EnumMap<>(DayOfWeek.class);

    static {
        DIAS_ES.put(DayOfWeek.MONDAY, "LUNES");
        DIAS_ES.put(DayOfWeek.TUESDAY, "MARTES");
        DIAS_ES.put(DayOfWeek.WEDNESDAY, "MIERCOLES");
        DIAS_ES.put(DayOfWeek.THURSDAY, "JUEVES");
        DIAS_ES.put(DayOfWeek.FRIDAY, "VIERNES");
        DIAS_ES.put(DayOfWeek.SATURDAY, "SABADO");
        DIAS_ES.put(DayOfWeek.SUNDAY, "DOMINGO");
    }

    private final ViajeRepository repository;
    private final ProgramacionViajeRepository programacionRepository;
    private final AsignacionProgramacionRepository asignacionRepository;
    private final RutaRepository rutaRepository;
    private final BusRepository busRepository;
    private final ChoferRepository choferRepository;
    private final ViajeMapper mapper;
    private final NotificacionService notificacionService;
    private final DependenciasEliminacionService dependenciasEliminacionService;
    private final AsistenciaReservaService asistenciaReservaService;

    @Override
    public List<ViajeDTO> listar() {
        return repository.findAll().stream().map(this::enriquecer).toList();
    }

    @Override
    public List<ViajeDTO> listarPorChofer(Long idChofer) {
        return repository.findByChofer_IdChoferOrderByFechaViajeDesc(idChofer).stream()
                .map(this::enriquecer).toList();
    }

    @Override
    @Transactional
    public List<ViajeDTO> listarPorRutaYFecha(Long idRuta, String fechaViaje) {
        LocalDate fecha = LocalDate.parse(fechaViaje);
        asegurarViajesGenerados(idRuta, fecha);
        return repository.findByProgramacion_Ruta_IdRutaAndFechaViaje(idRuta, fecha).stream()
                .map(this::enriquecer)
                .toList();
    }

    @Override
    public ViajeDTO buscarPorId(Long id) {
        Viaje entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viaje no encontrado."));
        return enriquecer(entity);
    }

    @Transactional
    @Override
    public ViajeDTO guardar(ViajeDTO dto) {
        ProgramacionViaje programacion = programacionRepository.findById(dto.getIdProgramacion())
                .orElseThrow(() -> new ResourceNotFoundException("Programación no encontrada."));
        Bus bus = busRepository.findById(dto.getIdBus())
                .orElseThrow(() -> new ResourceNotFoundException("Bus no encontrado."));
        Chofer chofer = choferRepository.findById(dto.getIdChofer())
                .orElseThrow(() -> new ResourceNotFoundException("Chofer no encontrado."));

        Viaje entity = mapper.toEntity(dto);
        entity.setProgramacion(programacion);
        entity.setBus(bus);
        entity.setChofer(chofer);
        if (entity.getEstado() == null || entity.getEstado().isBlank()) {
            entity.setEstado("PROGRAMADO");
        }
        return enriquecer(repository.save(entity));
    }

    @Transactional
    @Override
    public ViajeDTO actualizar(Long id, ViajeDTO dto) {
        Viaje entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viaje no encontrado."));

        ProgramacionViaje programacion = programacionRepository.findById(dto.getIdProgramacion())
                .orElseThrow(() -> new ResourceNotFoundException("Programación no encontrada."));
        Bus bus = busRepository.findById(dto.getIdBus())
                .orElseThrow(() -> new ResourceNotFoundException("Bus no encontrado."));
        Chofer chofer = choferRepository.findById(dto.getIdChofer())
                .orElseThrow(() -> new ResourceNotFoundException("Chofer no encontrado."));

        entity.setProgramacion(programacion);
        entity.setBus(bus);
        entity.setChofer(chofer);
        entity.setFechaViaje(dto.getFechaViaje());
        entity.setHoraInicioReal(dto.getHoraInicioReal());
        entity.setHoraFinReal(dto.getHoraFinReal());
        entity.setEstado(dto.getEstado());
        entity.setObservaciones(dto.getObservaciones());

        return enriquecer(repository.save(entity));
    }

    @Override
    @Transactional
    public ViajeDTO actualizarEstado(Long id, String estado) {
        Viaje entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viaje no encontrado."));

        entity.setEstado(estado);

        if ("EN_CURSO".equals(estado) || "EN_RUTA".equals(estado)) {
            if (entity.getHoraInicioReal() == null) {
                entity.setHoraInicioReal(LocalDateTime.now());
            }
        }

        if ("FINALIZADO".equals(estado) || "COMPLETADO".equals(estado)) {
            if (entity.getHoraInicioReal() == null) {
                entity.setHoraInicioReal(LocalDateTime.now());
            }
            entity.setHoraFinReal(LocalDateTime.now());
            asistenciaReservaService.marcarInasistencias(entity);
        }

        Viaje guardado = repository.save(entity);

        if (entity.getChofer() != null && entity.getChofer().getUsuario() != null) {
            Long idUsuario = entity.getChofer().getUsuario().getIdUsuario();
            try {
                if ("EN_CURSO".equals(estado) || "EN_RUTA".equals(estado)) {
                    notificacionService.enviar(
                            idUsuario,
                            "Viaje en curso",
                            "Tu viaje #" + id + " está activo. Valida embarques con QR.",
                            "VIAJE"
                    );
                } else if ("FINALIZADO".equals(estado)) {
                    long pendientes = repository.countByChofer_IdChoferAndFechaViajeAndEstadoIn(
                            entity.getChofer().getIdChofer(),
                            entity.getFechaViaje(),
                            List.of("PROGRAMADO", "EN_CURSO", "EN_RUTA")
                    );
                    String msg = pendientes > 0
                            ? "Viaje finalizado. Tienes " + pendientes + " viaje(s) pendiente(s) hoy."
                            : "Completaste todos tus viajes del día.";
                    notificacionService.enviar(idUsuario, "Viaje finalizado", msg, "VIAJE");
                }
            } catch (Exception ex) {
                log.warn("Viaje #{} actualizado, pero falló la notificación: {}", id, ex.getMessage());
            }
        }

        return enriquecer(guardado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Viaje entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viaje no encontrado."));
        dependenciasEliminacionService.eliminarDependenciasViaje(entity.getIdViaje());
    }

    @Override
    public List<ViajeDTO> listarHistorial() {
        return repository.findByEstadoIn(List.of("FINALIZADO", "COMPLETADO", "CANCELADO"))
                .stream()
                .sorted((a, b) -> b.getFechaViaje().compareTo(a.getFechaViaje()))
                .limit(50)
                .map(this::enriquecer)
                .toList();
    }

    private void asegurarViajesGenerados(Long idRuta, LocalDate fecha) {
        Ruta ruta = rutaRepository.findById(idRuta).orElse(null);
        if (ruta == null) return;

        String dia = DIAS_ES.get(fecha.getDayOfWeek());
        for (ProgramacionViaje programacion : programacionRepository.findByRuta(ruta)) {
            if (!Boolean.TRUE.equals(programacion.getEstado())) continue;
            if (!incluyeDia(programacion.getDiasOperacion(), dia)) continue;
            if (repository.existsByProgramacion_IdProgramacionAndFechaViaje(
                    programacion.getIdProgramacion(), fecha)) {
                continue;
            }

            AsignacionProgramacion asignacion = asignacionRepository
                    .findByProgramacion_IdProgramacion(programacion.getIdProgramacion()).stream()
                    .filter(a -> Boolean.TRUE.equals(a.getEstado()))
                    .filter(a -> !fecha.isBefore(a.getFechaInicio()))
                    .filter(a -> a.getFechaFin() == null || !fecha.isAfter(a.getFechaFin()))
                    .findFirst()
                    .orElse(null);

            if (asignacion == null) continue;

            Viaje viaje = Viaje.builder()
                    .programacion(programacion)
                    .bus(asignacion.getBus())
                    .chofer(asignacion.getChofer())
                    .fechaViaje(fecha)
                    .estado("PROGRAMADO")
                    .build();
            repository.save(viaje);
        }
    }

    private boolean incluyeDia(String diasOperacion, String dia) {
        if (diasOperacion == null || dia == null) return false;
        String normalizado = diasOperacion.toUpperCase(Locale.ROOT).replace("Á", "A");
        return normalizado.contains(dia);
    }

    private ViajeDTO enriquecer(Viaje entity) {
        ViajeDTO dto = mapper.toDTO(entity);
        ProgramacionViaje programacion = entity.getProgramacion();
        if (programacion != null) {
            if (programacion.getHoraSalida() != null) {
                dto.setHoraSalida(programacion.getHoraSalida().toString());
            }
            if (programacion.getHoraLlegadaEstimada() != null) {
                dto.setHoraLlegadaEstimada(programacion.getHoraLlegadaEstimada().toString());
            }
            Ruta ruta = programacion.getRuta();
            if (ruta != null) {
                dto.setIdRuta(ruta.getIdRuta());
                dto.setCodigoRuta(ruta.getCodigo());
                dto.setNombreRuta(ruta.getNombre());
            }
        }
        return dto;
    }
}
