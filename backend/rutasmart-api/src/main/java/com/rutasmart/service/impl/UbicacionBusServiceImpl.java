package com.rutasmart.service.impl;

import com.rutasmart.dto.UbicacionBusDTO;
import com.rutasmart.entity.UbicacionBus;
import com.rutasmart.entity.Viaje;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.UbicacionBusMapper;
import com.rutasmart.repository.UbicacionBusRepository;
import com.rutasmart.repository.ViajeRepository;
import com.rutasmart.service.interfaces.UbicacionBusService;
import com.rutasmart.service.ArrivalNotificationService;
import com.rutasmart.websocket.TrackingBroadcastService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UbicacionBusServiceImpl implements UbicacionBusService {

    private final UbicacionBusRepository ubicacionBusRepository;
    private final ViajeRepository viajeRepository;
    private final UbicacionBusMapper ubicacionBusMapper;
    private final TrackingBroadcastService trackingBroadcastService;
    private final ArrivalNotificationService arrivalNotificationService;

    @Override
    public List<UbicacionBusDTO> listar() {
        return ubicacionBusMapper.toDTOList(
                ubicacionBusRepository.findAll()
        );
    }

    @Override
    public UbicacionBusDTO buscarPorId(Long id) {

        UbicacionBus ubicacion = ubicacionBusRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ubicación no encontrada."
                        ));

        return ubicacionBusMapper.toDTO(ubicacion);

    }

    @Transactional
    @Override
    public UbicacionBusDTO guardar(UbicacionBusDTO dto) {

        Viaje viaje = viajeRepository.findById(dto.getIdViaje())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Viaje no encontrado."
                        ));

        UbicacionBus ubicacion =
                ubicacionBusMapper.toEntity(dto);

        ubicacion.setViaje(viaje);

        UbicacionBus guardada =
                ubicacionBusRepository.save(ubicacion);

        UbicacionBusDTO result = enriquecerCodigoRuta(ubicacionBusMapper.toDTO(guardada));
        trackingBroadcastService.broadcast("UBICACION", result);
        try {
            arrivalNotificationService.evaluarLlegada(guardada);
        } catch (Exception ignored) { }
        return result;

    }

    @Transactional
    @Override
    public UbicacionBusDTO actualizar(Long id,
                                      UbicacionBusDTO dto) {

        UbicacionBus ubicacion =
                ubicacionBusRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Ubicación no encontrada."
                                ));

        Viaje viaje = viajeRepository.findById(dto.getIdViaje())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Viaje no encontrado."
                        ));

        ubicacion.setViaje(viaje);
        ubicacion.setLatitud(dto.getLatitud());
        ubicacion.setLongitud(dto.getLongitud());
        ubicacion.setVelocidad(dto.getVelocidad());

        UbicacionBus actualizada =
                ubicacionBusRepository.save(ubicacion);

        return ubicacionBusMapper.toDTO(actualizada);

    }

    @Transactional
    @Override
    public void eliminar(Long id) {

        UbicacionBus ubicacion =
                ubicacionBusRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Ubicación no encontrada."
                                ));

        ubicacionBusRepository.delete(ubicacion);

    }

    @Override
    public List<UbicacionBusDTO> listarActivas() {
        return ubicacionBusRepository.findUltimasDeViajesActivos().stream()
                .map(ubicacionBusMapper::toDTO)
                .map(this::enriquecerCodigoRuta)
                .toList();
    }

    @Override
    public UbicacionBusDTO ultimaPorViaje(Long idViaje) {
        return ubicacionBusRepository
                .findFirstByViaje_IdViajeOrderByFechaHoraDesc(idViaje)
                .map(ubicacionBusMapper::toDTO)
                .map(this::enriquecerCodigoRuta)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No hay ubicaciones para el viaje."
                        ));
    }

    private UbicacionBusDTO enriquecerCodigoRuta(UbicacionBusDTO dto) {
        if (dto.getIdViaje() == null) {
            return dto;
        }
        viajeRepository.findById(dto.getIdViaje()).ifPresent(viaje -> {
            if (viaje.getProgramacion() != null && viaje.getProgramacion().getRuta() != null) {
                dto.setCodigoRuta(viaje.getProgramacion().getRuta().getCodigo());
            }
        });
        return dto;
    }

}