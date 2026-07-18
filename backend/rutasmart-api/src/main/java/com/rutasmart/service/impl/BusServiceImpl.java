package com.rutasmart.service.impl;

import com.rutasmart.dto.BusDTO;
import com.rutasmart.entity.Bus;
import com.rutasmart.exception.BusinessException;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.BusMapper;
import com.rutasmart.repository.BusRepository;
import com.rutasmart.repository.ViajeRepository;
import com.rutasmart.service.interfaces.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;
    private final BusMapper busMapper;
    private final ViajeRepository viajeRepository;

    @Override
    public List<BusDTO> listar() {
        return busMapper.toDTOList(busRepository.findAll());
    }

    @Override
    public BusDTO buscarPorId(Long id) {

        Bus bus = busRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bus no encontrado."));

        return busMapper.toDTO(bus);
    }

    @Override
    public BusDTO guardar(BusDTO dto) {

        if (busRepository.existsByCodigo(dto.getCodigo())) {
            throw new BusinessException("El código del bus ya existe.");
        }

        if (busRepository.existsByPlaca(dto.getPlaca())) {
            throw new BusinessException("La placa ya existe.");
        }

        Bus bus = busMapper.toEntity(dto);

        Bus guardado = busRepository.save(bus);

        return busMapper.toDTO(guardado);

    }

    @Override
    public BusDTO actualizar(Long id, BusDTO dto) {

        Bus bus = busRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bus no encontrado."));

        if (!bus.getCodigo().equals(dto.getCodigo())
                && busRepository.existsByCodigo(dto.getCodigo())) {

            throw new BusinessException("El código del bus ya existe.");
        }

        if (!bus.getPlaca().equals(dto.getPlaca())
                && busRepository.existsByPlaca(dto.getPlaca())) {

            throw new BusinessException("La placa ya existe.");
        }

        bus.setCodigo(dto.getCodigo());
        bus.setPlaca(dto.getPlaca());
        bus.setMarca(dto.getMarca());
        bus.setModelo(dto.getModelo());
        bus.setAnio(dto.getAnio());
        bus.setColor(dto.getColor());
        bus.setCapacidadAsientos(dto.getCapacidadAsientos());
        bus.setObservaciones(dto.getObservaciones());
        bus.setEstado(dto.getEstado());

        return busMapper.toDTO(busRepository.save(bus));

    }

    @Override
    @Transactional
    public void eliminar(Long id) {

        Bus bus = busRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bus no encontrado."));

        if (viajeRepository.countByBus_IdBus(id) > 0) {
            throw new BusinessException(
                    "No se puede eliminar el bus porque tiene viajes registrados. Elimina los viajes primero.");
        }

        busRepository.delete(bus);

    }

}