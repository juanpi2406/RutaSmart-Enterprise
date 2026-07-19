package com.rutasmart.service.impl;

import com.rutasmart.dto.request.ChoferCreateDTO;
import com.rutasmart.dto.request.ChoferUpdateDTO;
import com.rutasmart.dto.response.ChoferResponseDTO;
import com.rutasmart.entity.Chofer;
import com.rutasmart.entity.Usuario;
import com.rutasmart.exception.BusinessException;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.ChoferMapper;
import com.rutasmart.repository.AsignacionProgramacionRepository;
import com.rutasmart.repository.ChoferRepository;
import com.rutasmart.repository.UsuarioRepository;
import com.rutasmart.repository.ViajeRepository;
import com.rutasmart.service.interfaces.ChoferService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class ChoferServiceImpl implements ChoferService {

    private final ChoferRepository choferRepository;
    private final UsuarioRepository usuarioRepository;
    private final ChoferMapper choferMapper;
    private final ViajeRepository viajeRepository;
    private final AsignacionProgramacionRepository asignacionRepository;

    @Override
    public List<ChoferResponseDTO> listar() {

        return choferMapper.toResponseDTOList(
                choferRepository.findAll()
        );

    }

    @Override
    public ChoferResponseDTO obtenerPorId(Long id) {

        Chofer chofer = choferRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Chofer no encontrado."
                        ));

        return choferMapper.toResponseDTO(chofer);

    }

    @Override
    public ChoferResponseDTO obtenerPorIdUsuario(Long idUsuario) {

        Chofer chofer = choferRepository.findByUsuario_IdUsuario(idUsuario)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Chofer no encontrado para el usuario."
                        ));

        return choferMapper.toResponseDTO(chofer);

    }

    @Transactional
    @Override
    public ChoferResponseDTO crear(ChoferCreateDTO dto) {

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));

        if (choferRepository.existsByUsuario_IdUsuario(usuario.getIdUsuario())) {

            throw new BusinessException(
                    "El usuario ya está registrado como chofer."
            );

        }

        if (choferRepository.existsByNumeroLicencia(dto.getNumeroLicencia())) {

            throw new BusinessException(
                    "El número de licencia ya existe."
            );

        }

        Chofer chofer = choferMapper.toEntity(dto);

        chofer.setUsuario(usuario);

        Chofer guardado = choferRepository.save(chofer);

        return choferMapper.toResponseDTO(guardado);

    }

    @Transactional
    @Override
    public ChoferResponseDTO actualizar(Long id,
                                        ChoferUpdateDTO dto) {

        Chofer chofer = choferRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Chofer no encontrado."
                        ));

        if (!chofer.getNumeroLicencia().equals(dto.getNumeroLicencia())
                && choferRepository.existsByNumeroLicencia(dto.getNumeroLicencia())) {

            throw new BusinessException(
                    "El número de licencia ya existe."
            );

        }

        chofer.setNumeroLicencia(dto.getNumeroLicencia());
        chofer.setCategoriaLicencia(dto.getCategoriaLicencia());
        chofer.setFechaVencimiento(dto.getFechaVencimiento());
        chofer.setEstado(dto.getEstado());

        Chofer actualizado = choferRepository.save(chofer);

        return choferMapper.toResponseDTO(actualizado);

    }

    @Override
    @Transactional
    public void eliminar(Long id) {

        Chofer chofer = choferRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Chofer no encontrado."
                        ));

        if (viajeRepository.countByChofer_IdChofer(id) > 0) {
            throw new BusinessException(
                    "No se puede eliminar el chofer porque tiene viajes registrados. Elimina los viajes primero.");
        }

        if (!asignacionRepository.findByChofer_IdChofer(id).isEmpty()) {
            throw new BusinessException(
                    "No se puede eliminar el chofer porque tiene asignaciones activas.");
        }

        choferRepository.delete(chofer);

    }

}
