package com.rutasmart.service.impl;

import com.rutasmart.dto.UbicacionBusDTO;
import com.rutasmart.entity.UbicacionBus;
import com.rutasmart.entity.Viaje;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.UbicacionBusMapper;
import com.rutasmart.repository.UbicacionBusRepository;
import com.rutasmart.repository.ViajeRepository;
import com.rutasmart.service.interfaces.UbicacionBusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UbicacionBusServiceImpl implements UbicacionBusService {

    private final UbicacionBusRepository ubicacionBusRepository;
    private final ViajeRepository viajeRepository;
    private final UbicacionBusMapper ubicacionBusMapper;

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

        return ubicacionBusMapper.toDTO(guardada);

    }

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

}