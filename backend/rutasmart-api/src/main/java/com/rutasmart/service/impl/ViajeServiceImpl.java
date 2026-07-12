package com.rutasmart.service.impl;

import com.rutasmart.dto.ViajeDTO;
import com.rutasmart.entity.Bus;
import com.rutasmart.entity.Chofer;
import com.rutasmart.entity.ProgramacionViaje;
import com.rutasmart.entity.Viaje;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.ViajeMapper;
import com.rutasmart.repository.BusRepository;
import com.rutasmart.repository.ChoferRepository;
import com.rutasmart.repository.ProgramacionViajeRepository;
import com.rutasmart.repository.ViajeRepository;
import com.rutasmart.service.interfaces.ViajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ViajeServiceImpl implements ViajeService {

    private final ViajeRepository repository;
    private final ProgramacionViajeRepository programacionRepository;
    private final BusRepository busRepository;
    private final ChoferRepository choferRepository;
    private final ViajeMapper mapper;

    @Override
    public List<ViajeDTO> listar() {
        return mapper.toDTOList(repository.findAll());
    }

    @Override
    public List<ViajeDTO> listarPorRutaYFecha(Long idRuta, String fechaViaje) {
        LocalDate fecha = LocalDate.parse(fechaViaje);
        return mapper.toDTOList(repository.findByProgramacion_Ruta_IdRutaAndFechaViaje(idRuta, fecha));
    }

    @Override
    public ViajeDTO buscarPorId(Long id) {

        Viaje entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Viaje no encontrado."));

        return mapper.toDTO(entity);
    }

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

        return mapper.toDTO(repository.save(entity));
    }

    @Override
    public ViajeDTO actualizar(Long id, ViajeDTO dto) {

        Viaje entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Viaje no encontrado."));

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

        return mapper.toDTO(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {

        Viaje entity = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Viaje no encontrado."));

        repository.delete(entity);
    }
}