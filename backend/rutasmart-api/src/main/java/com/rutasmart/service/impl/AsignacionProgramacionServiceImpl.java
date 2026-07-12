package com.rutasmart.service.impl;

import com.rutasmart.dto.AsignacionProgramacionDTO;
import com.rutasmart.entity.AsignacionProgramacion;
import com.rutasmart.entity.Bus;
import com.rutasmart.entity.Chofer;
import com.rutasmart.entity.ProgramacionViaje;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.AsignacionProgramacionMapper;
import com.rutasmart.repository.AsignacionProgramacionRepository;
import com.rutasmart.repository.BusRepository;
import com.rutasmart.repository.ChoferRepository;
import com.rutasmart.repository.ProgramacionViajeRepository;
import com.rutasmart.service.interfaces.AsignacionProgramacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AsignacionProgramacionServiceImpl implements AsignacionProgramacionService {

    private final AsignacionProgramacionRepository repository;
    private final ProgramacionViajeRepository programacionRepository;
    private final BusRepository busRepository;
    private final ChoferRepository choferRepository;
    private final AsignacionProgramacionMapper mapper;

    @Override
    public List<AsignacionProgramacionDTO> listar() {
        return mapper.toDTOList(repository.findAll());
    }

    @Override
    public AsignacionProgramacionDTO buscarPorId(Long id) {

        AsignacionProgramacion entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Asignación no encontrada."));

        return mapper.toDTO(entity);
    }

    @Override
    public AsignacionProgramacionDTO guardar(AsignacionProgramacionDTO dto) {

        ProgramacionViaje programacion = programacionRepository.findById(dto.getIdProgramacion())
                .orElseThrow(() -> new ResourceNotFoundException("Programación no encontrada."));

        Bus bus = busRepository.findById(dto.getIdBus())
                .orElseThrow(() -> new ResourceNotFoundException("Bus no encontrado."));

        Chofer chofer = choferRepository.findById(dto.getIdChofer())
                .orElseThrow(() -> new ResourceNotFoundException("Chofer no encontrado."));

        AsignacionProgramacion entity = mapper.toEntity(dto);

        entity.setProgramacion(programacion);
        entity.setBus(bus);
        entity.setChofer(chofer);

        return mapper.toDTO(repository.save(entity));
    }

    @Override
    public AsignacionProgramacionDTO actualizar(Long id, AsignacionProgramacionDTO dto) {

        AsignacionProgramacion entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Asignación no encontrada."));

        ProgramacionViaje programacion = programacionRepository.findById(dto.getIdProgramacion())
                .orElseThrow(() -> new ResourceNotFoundException("Programación no encontrada."));

        Bus bus = busRepository.findById(dto.getIdBus())
                .orElseThrow(() -> new ResourceNotFoundException("Bus no encontrado."));

        Chofer chofer = choferRepository.findById(dto.getIdChofer())
                .orElseThrow(() -> new ResourceNotFoundException("Chofer no encontrado."));

        entity.setProgramacion(programacion);
        entity.setBus(bus);
        entity.setChofer(chofer);
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaFin(dto.getFechaFin());
        entity.setEstado(dto.getEstado());

        return mapper.toDTO(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {

        AsignacionProgramacion entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Asignación no encontrada."));

        repository.delete(entity);
    }
}