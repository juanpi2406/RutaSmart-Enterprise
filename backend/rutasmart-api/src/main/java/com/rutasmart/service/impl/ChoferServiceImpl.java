package com.rutasmart.service.impl;

<<<<<<< HEAD
import com.rutasmart.dto.request.ChoferCreateDTO;
import com.rutasmart.dto.request.ChoferUpdateDTO;
import com.rutasmart.dto.response.ChoferResponseDTO;
=======
import com.rutasmart.dto.ChoferDTO;
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
import com.rutasmart.entity.Chofer;
import com.rutasmart.entity.Usuario;
import com.rutasmart.exception.BusinessException;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.ChoferMapper;
import com.rutasmart.repository.ChoferRepository;
import com.rutasmart.repository.UsuarioRepository;
import com.rutasmart.service.interfaces.ChoferService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChoferServiceImpl implements ChoferService {

    private final ChoferRepository choferRepository;
<<<<<<< HEAD
    private final UsuarioRepository usuarioRepository;
    private final ChoferMapper choferMapper;

    @Override
    public List<ChoferResponseDTO> listar() {

        return choferMapper.toResponseDTOList(
                choferRepository.findAll()
        );

    }

    @Override
    public ChoferResponseDTO obtenerPorId(Long id) {
=======

    private final UsuarioRepository usuarioRepository;

    private final ChoferMapper choferMapper;

    @Override
    public List<ChoferDTO> listar() {
        return choferMapper.toDTOList(
                choferRepository.findAll()
        );
    }

    @Override
    public ChoferDTO buscarPorId(Long id) {
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

        Chofer chofer = choferRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Chofer no encontrado."
                        ));

<<<<<<< HEAD
        return choferMapper.toResponseDTO(chofer);
=======
        return choferMapper.toDTO(chofer);
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

    }

    @Override
<<<<<<< HEAD
    public ChoferResponseDTO crear(ChoferCreateDTO dto) {
=======
    public ChoferDTO guardar(ChoferDTO dto) {

        if (choferRepository.existsByLicencia(dto.getLicencia())) {

            throw new BusinessException(
                    "La licencia ya existe."
            );

        }
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));

<<<<<<< HEAD
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

=======
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
        Chofer chofer = choferMapper.toEntity(dto);

        chofer.setUsuario(usuario);

        Chofer guardado = choferRepository.save(chofer);

<<<<<<< HEAD
        return choferMapper.toResponseDTO(guardado);
=======
        return choferMapper.toDTO(guardado);
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

    }

    @Override
<<<<<<< HEAD
    public ChoferResponseDTO actualizar(Long id,
                                        ChoferUpdateDTO dto) {
=======
    public ChoferDTO actualizar(Long id, ChoferDTO dto) {
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

        Chofer chofer = choferRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Chofer no encontrado."
                        ));

<<<<<<< HEAD
        if (!chofer.getNumeroLicencia().equals(dto.getNumeroLicencia())
                && choferRepository.existsByNumeroLicencia(dto.getNumeroLicencia())) {

            throw new BusinessException(
                    "El número de licencia ya existe."
=======
        if (!chofer.getLicencia().equals(dto.getLicencia())
                && choferRepository.existsByLicencia(dto.getLicencia())) {

            throw new BusinessException(
                    "La licencia ya existe."
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
            );

        }

<<<<<<< HEAD
       chofer.setNumeroLicencia(dto.getNumeroLicencia());
        chofer.setCategoriaLicencia(dto.getCategoriaLicencia());
        chofer.setFechaVencimiento(dto.getFechaVencimiento());

=======
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));

        chofer.setUsuario(usuario);
        chofer.setLicencia(dto.getLicencia());
        chofer.setCategoriaLicencia(dto.getCategoriaLicencia());
        chofer.setFechaVencimiento(dto.getFechaVencimiento());
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
        chofer.setEstado(dto.getEstado());

        Chofer actualizado = choferRepository.save(chofer);

<<<<<<< HEAD
        return choferMapper.toResponseDTO(actualizado);
=======
        return choferMapper.toDTO(actualizado);
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

    }

    @Override
    public void eliminar(Long id) {

        Chofer chofer = choferRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Chofer no encontrado."
                        ));

        choferRepository.delete(chofer);

    }

}