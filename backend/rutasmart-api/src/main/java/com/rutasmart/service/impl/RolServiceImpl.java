package com.rutasmart.service.impl;

import com.rutasmart.dto.RolDTO;
import com.rutasmart.entity.Rol;
import com.rutasmart.exception.BusinessException;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.RolMapper;
import com.rutasmart.repository.RolRepository;
import com.rutasmart.service.interfaces.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class RolServiceImpl implements RolService {

    private final RolRepository repository;
    private final RolMapper mapper;

    @Override
    public List<RolDTO> listar() {
        return mapper.toDTOList(repository.findAll());
    }

    @Override
    public RolDTO buscarPorId(Long id) {

        Rol rol = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Rol no encontrado."));

        return mapper.toDTO(rol);
    }

    @Transactional
    @Override
    public RolDTO guardar(RolDTO dto) {

        if (repository.existsByNombre(dto.getNombre())) {
            throw new BusinessException("El nombre del rol ya existe.");
        }

        Rol rol = mapper.toEntity(dto);

        rol.setIdRol(null);

        Rol guardado = repository.save(rol);

        return mapper.toDTO(guardado);
    }

    @Transactional
    @Override
    public RolDTO actualizar(Long id, RolDTO dto) {

        Rol rol = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Rol no encontrado."));

        if (!rol.getNombre().equals(dto.getNombre())
                && repository.existsByNombre(dto.getNombre())) {

            throw new BusinessException("El nombre del rol ya existe.");
        }

        mapper.updateEntity(dto, rol);

        Rol actualizado = repository.save(rol);

        return mapper.toDTO(actualizado);
    }

    @Transactional
    @Override
    public void eliminar(Long id) {

        Rol rol = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Rol no encontrado."));

        repository.delete(rol);
    }
}