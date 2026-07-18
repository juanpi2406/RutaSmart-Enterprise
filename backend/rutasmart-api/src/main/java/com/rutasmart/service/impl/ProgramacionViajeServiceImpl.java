package com.rutasmart.service.impl;

import com.rutasmart.dto.ProgramacionViajeDTO;
import com.rutasmart.entity.ProgramacionViaje;
import com.rutasmart.entity.Ruta;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.ProgramacionViajeMapper;
import com.rutasmart.repository.ProgramacionViajeRepository;
import com.rutasmart.repository.RutaRepository;
import com.rutasmart.service.DependenciasEliminacionService;
import com.rutasmart.service.interfaces.ProgramacionViajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgramacionViajeServiceImpl implements ProgramacionViajeService {

    private final ProgramacionViajeRepository repository;
    private final RutaRepository rutaRepository;
    private final ProgramacionViajeMapper mapper;
    private final DependenciasEliminacionService dependenciasEliminacionService;

    @Override
    public List<ProgramacionViajeDTO> listar() {
        return mapper.toDTOList(repository.findAll());
    }

    @Override
    public ProgramacionViajeDTO buscarPorId(Long id) {

        ProgramacionViaje entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Programación no encontrada."));

        return mapper.toDTO(entity);

    }

    @Override
    public ProgramacionViajeDTO guardar(ProgramacionViajeDTO dto) {

        Ruta ruta = rutaRepository.findById(dto.getIdRuta())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ruta no encontrada."));

        ProgramacionViaje entity = mapper.toEntity(dto);

        entity.setRuta(ruta);

        return mapper.toDTO(repository.save(entity));

    }

    @Override
    public ProgramacionViajeDTO actualizar(Long id,
                                           ProgramacionViajeDTO dto) {

        ProgramacionViaje entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Programación no encontrada."));

        Ruta ruta = rutaRepository.findById(dto.getIdRuta())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ruta no encontrada."));

        entity.setRuta(ruta);
        entity.setHoraSalida(dto.getHoraSalida());
        entity.setHoraLlegadaEstimada(dto.getHoraLlegadaEstimada());
        entity.setDiasOperacion(dto.getDiasOperacion());
        entity.setEstado(dto.getEstado());

        return mapper.toDTO(repository.save(entity));

    }

    @Override
    @Transactional
    public void eliminar(Long id) {

        ProgramacionViaje entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Programación no encontrada."));

        dependenciasEliminacionService.eliminarDependenciasProgramacion(entity);
        repository.delete(entity);

    }

}