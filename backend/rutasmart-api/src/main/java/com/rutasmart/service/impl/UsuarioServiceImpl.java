package com.rutasmart.service.impl;

import com.rutasmart.dto.UsuarioDTO;
import com.rutasmart.entity.Rol;
import com.rutasmart.entity.Usuario;
import com.rutasmart.exception.BusinessException;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.UsuarioMapper;
import com.rutasmart.repository.RolRepository;
import com.rutasmart.repository.UsuarioRepository;
import com.rutasmart.service.interfaces.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final RolRepository rolRepository;

    private final UsuarioMapper usuarioMapper;

    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UsuarioDTO> listar() {

        return usuarioMapper.toDTOList(
                usuarioRepository.findAll()
        );

    }

    @Override
    public UsuarioDTO buscarPorId(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));

        return usuarioMapper.toDTO(usuario);

    }

    @Override
    public UsuarioDTO guardar(UsuarioDTO dto) {

        if (usuarioRepository.existsByCodigo(dto.getCodigo())) {

            throw new BusinessException(
                    "El código ya existe."
            );

        }

        if (usuarioRepository.existsByCorreo(dto.getCorreo())) {

            throw new BusinessException(
                    "El correo ya existe."
            );

        }

        Rol rol = rolRepository.findById(dto.getIdRol())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Rol no encontrado."
                        ));

        Usuario usuario = usuarioMapper.toEntity(dto);

        usuario.setRol(rol);

        /*
         * Temporal.
         * Más adelante usaremos UsuarioCreateDTO
         */

        usuario.setPasswordHash(
                passwordEncoder.encode("123456")
        );

        Usuario guardado =
                usuarioRepository.save(usuario);

        return usuarioMapper.toDTO(guardado);

    }

    @Override
    public UsuarioDTO actualizar(Long id,
                                 UsuarioDTO dto) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));

        if (!usuario.getCodigo().equals(dto.getCodigo())
                && usuarioRepository.existsByCodigo(dto.getCodigo())) {

            throw new BusinessException(
                    "El código ya existe."
            );

        }

        if (!usuario.getCorreo().equals(dto.getCorreo())
                && usuarioRepository.existsByCorreo(dto.getCorreo())) {

            throw new BusinessException(
                    "El correo ya existe."
            );

        }

        Rol rol = rolRepository.findById(dto.getIdRol())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Rol no encontrado."
                        ));

        usuario.setCodigo(dto.getCodigo());
        usuario.setNombres(dto.getNombres());
        usuario.setApellidos(dto.getApellidos());
        usuario.setCorreo(dto.getCorreo());
        usuario.setTelefono(dto.getTelefono());
        usuario.setEstado(dto.getEstado());
        usuario.setRol(rol);

        Usuario actualizado =
                usuarioRepository.save(usuario);

        return usuarioMapper.toDTO(actualizado);

    }

    @Override
    public void eliminar(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));

        usuarioRepository.delete(usuario);

    }

}