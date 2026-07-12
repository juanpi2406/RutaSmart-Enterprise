package com.rutasmart.service.impl;

import com.rutasmart.dto.AsientoDTO;
import com.rutasmart.entity.Asiento;
import com.rutasmart.entity.Viaje;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.AsientoMapper;
import com.rutasmart.repository.AsientoRepository;
import com.rutasmart.repository.ViajeRepository;
import com.rutasmart.service.interfaces.AsientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AsientoServiceImpl implements AsientoService {

    private final AsientoRepository repository;
    private final ViajeRepository viajeRepository;
    private final AsientoMapper mapper;

    @Override
    public List<AsientoDTO> listarPorViaje(Long idViaje) {
        return mapper.toDTOList(repository.findByViaje_IdViaje(idViaje));
    }

    @Override
    public AsientoDTO guardar(AsientoDTO dto) {
        Viaje viaje = viajeRepository.getReferenceById(dto.getIdViaje());
        Asiento entity = mapper.toEntity(dto);
        entity.setViaje(viaje);
        Asiento guardado = repository.save(entity);
        return mapper.toDTO(guardado);
    }

    @Override
    public AsientoDTO actualizar(Long id, AsientoDTO dto) {
        Asiento entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asiento no encontrado."));
        entity.setNumeroAsiento(dto.getNumeroAsiento());
        entity.setEstado(dto.getEstado());
        Asiento actualizado = repository.save(entity);
        return mapper.toDTO(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

}
