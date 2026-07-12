package com.rutasmart.service.impl;

import com.rutasmart.dto.ParaderoDTO;
import com.rutasmart.entity.Paradero;
import com.rutasmart.entity.Ruta;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.ParaderoMapper;
import com.rutasmart.repository.ParaderoRepository;
import com.rutasmart.repository.RutaRepository;
import com.rutasmart.service.interfaces.ParaderoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParaderoServiceImpl implements ParaderoService {

    private final ParaderoRepository repository;
    private final RutaRepository rutaRepository;
    private final ParaderoMapper mapper;

    @Override
    public List<ParaderoDTO> listar() {
        return mapper.toDTOList(repository.findAll());
    }

    @Override
    public List<ParaderoDTO> listarPorRuta(Long idRuta) {
        Ruta ruta = rutaRepository.getReferenceById(idRuta);
        return mapper.toDTOList(repository.findByRutaOrderByOrdenAsc(ruta));
    }

    @Override
    public ParaderoDTO buscarPorId(Long id) {

        Paradero entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Paradero no encontrado."));

        return mapper.toDTO(entity);
    }

    @Override
    public ParaderoDTO guardar(ParaderoDTO dto) {

        Ruta ruta = rutaRepository.findById(dto.getIdRuta())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ruta no encontrada."));

        Paradero entity = mapper.toEntity(dto);

        entity.setRuta(ruta);

        return mapper.toDTO(repository.save(entity));

    }

    @Override
    public ParaderoDTO actualizar(Long id, ParaderoDTO dto) {

        Paradero entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Paradero no encontrado."));

        Ruta ruta = rutaRepository.findById(dto.getIdRuta())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ruta no encontrada."));

        entity.setRuta(ruta);
        entity.setNombre(dto.getNombre());
        entity.setDireccion(dto.getDireccion());
        entity.setLatitud(dto.getLatitud());
        entity.setLongitud(dto.getLongitud());
        entity.setOrden(dto.getOrden());
        entity.setTiempoEstimadoMin(dto.getTiempoEstimadoMin());
        entity.setEstado(dto.getEstado());

        return mapper.toDTO(repository.save(entity));

    }

    @Override
    public void eliminar(Long id) {

        Paradero entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Paradero no encontrado."));

        repository.delete(entity);

    }

}