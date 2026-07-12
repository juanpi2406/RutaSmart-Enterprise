package com.rutasmart.service.impl;

import com.rutasmart.dto.RutaDTO;
import com.rutasmart.entity.Ruta;
import com.rutasmart.exception.BusinessException;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.RutaMapper;
import com.rutasmart.repository.RutaRepository;
import com.rutasmart.service.interfaces.RutaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RutaServiceImpl implements RutaService {

    private final RutaRepository rutaRepository;
    private final RutaMapper rutaMapper;

    @Override
    public List<RutaDTO> listar() {
        return rutaMapper.toDTOList(rutaRepository.findAll());
    }

    @Override
    public RutaDTO buscarPorId(Long id) {

        Ruta ruta = rutaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ruta no encontrada."));

        return rutaMapper.toDTO(ruta);

    }

    @Override
    public RutaDTO guardar(RutaDTO dto) {

        if (rutaRepository.existsByCodigo(dto.getCodigo())) {
            throw new BusinessException("El código de ruta ya existe.");
        }

        Ruta ruta = rutaMapper.toEntity(dto);

        return rutaMapper.toDTO(
                rutaRepository.save(ruta)
        );

    }

    @Override
    public RutaDTO actualizar(Long id, RutaDTO dto) {

        Ruta ruta = rutaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ruta no encontrada."));

        if (!ruta.getCodigo().equals(dto.getCodigo())
                && rutaRepository.existsByCodigo(dto.getCodigo())) {

            throw new BusinessException("El código de ruta ya existe.");
        }

        ruta.setCodigo(dto.getCodigo());
        ruta.setNombre(dto.getNombre());
        ruta.setOrigen(dto.getOrigen());
        ruta.setDestino(dto.getDestino());
        ruta.setDescripcion(dto.getDescripcion());
        ruta.setDistanciaKm(dto.getDistanciaKm());
        ruta.setTiempoEstimadoMin(dto.getTiempoEstimadoMin());
        ruta.setEstado(dto.getEstado());

        return rutaMapper.toDTO(
                rutaRepository.save(ruta)
        );

    }

    @Override
    public void eliminar(Long id) {

        Ruta ruta = rutaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ruta no encontrada."));

        rutaRepository.delete(ruta);

    }

}