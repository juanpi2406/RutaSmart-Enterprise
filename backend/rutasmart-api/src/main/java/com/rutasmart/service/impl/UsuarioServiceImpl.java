package com.rutasmart.service.impl;

import com.rutasmart.dto.UsuarioCreateDTO;
import com.rutasmart.dto.UsuarioResponseDTO;
import com.rutasmart.dto.UsuarioUpdateDTO;
import com.rutasmart.entity.Alumno;
import com.rutasmart.entity.Chofer;
import com.rutasmart.entity.Rol;
import com.rutasmart.entity.Usuario;
import com.rutasmart.exception.BusinessException;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.UsuarioMapper;
import com.rutasmart.repository.AlumnoRepository;
import com.rutasmart.repository.ChoferRepository;
import com.rutasmart.repository.RolRepository;
import com.rutasmart.repository.UsuarioRepository;
import com.rutasmart.service.interfaces.UsuarioService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final AlumnoRepository alumnoRepository;
    private final ChoferRepository choferRepository;

    @Override
    public List<UsuarioResponseDTO> listar() {

        return usuarioMapper.toResponseDTOList(
                usuarioRepository.findAll()
        );

    }

    @Override
    public UsuarioResponseDTO buscarPorId(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));

        return usuarioMapper.toResponseDTO(usuario);

    }

    @Override
    @Transactional
    public UsuarioResponseDTO guardar(UsuarioCreateDTO dto) {

        //=========================================
                // NORMALIZAR DATOS
                //=========================================

                dto.setCodigo(dto.getCodigo().trim().toUpperCase());
                dto.setCorreo(dto.getCorreo().trim().toLowerCase());

                if (dto.getCodigoUniversitario() != null) {
                dto.setCodigoUniversitario(
                        dto.getCodigoUniversitario().trim().toUpperCase()
                );
                }

                if (dto.getNumeroLicencia() != null) {
                dto.setNumeroLicencia(
                        dto.getNumeroLicencia().trim().toUpperCase()
                );
                }


        //=========================================
        // VALIDACIONES USUARIO
        //=========================================

        if (usuarioRepository.existsByCodigo(dto.getCodigo())) {
            throw new BusinessException("El código ya existe.");
        }

        if (usuarioRepository.existsByCorreo(dto.getCorreo())) {
            throw new BusinessException("El correo ya existe.");
        }

        //=========================================
        // BUSCAR ROL
        //=========================================

        Rol rol = rolRepository.findById(dto.getIdRol())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Rol no encontrado."
                        ));

        //=========================================
        // CREAR USUARIO
        //=========================================

        Usuario usuario = usuarioMapper.toEntity(dto);

        usuario.setRol(rol);

        String passwordTemporal = "123456";

        usuario.setPasswordHash(
                passwordEncoder.encode(passwordTemporal)
        );

        Usuario guardado = usuarioRepository.save(usuario);

        //=========================================
        // SEGÚN EL ROL
        //=========================================

        String nombreRol = rol.getNombre().trim().toUpperCase();

        switch (nombreRol) {

            case "ALUMNO":
                registrarAlumno(dto, guardado);
                break;

            case "CHOFER":
                registrarChofer(dto, guardado);
                break;

            case "ADMINISTRADOR":
            case "OPERADOR":
                // No requieren tabla adicional
                break;

            default:
                throw new BusinessException(
                        "Rol no soportado: " + nombreRol
                );
        }

        return usuarioMapper.toResponseDTO(guardado);

    }

    /**
     * =========================================
     * REGISTRAR ALUMNO
     * =========================================
     */
    private void registrarAlumno(
            UsuarioCreateDTO dto,
            Usuario usuario) {

        if (dto.getCodigoUniversitario() == null
                || dto.getCodigoUniversitario().isBlank()) {

            throw new BusinessException(
                    "Debe ingresar el código universitario."
            );

        }

        if (alumnoRepository.existsByCodigoUniversitario(
                dto.getCodigoUniversitario())) {

            throw new BusinessException(
                    "El código universitario ya existe."
            );

        }

        Alumno alumno = Alumno.builder()
                .usuario(usuario)
                .codigoUniversitario(dto.getCodigoUniversitario())
                .facultad(dto.getFacultad())
                .sede(dto.getSede())
                .ciclo(dto.getCiclo())
                .estado(true)
                .build();

        alumnoRepository.save(alumno);

    }

    /**
     * =========================================
     * REGISTRAR CHOFER
     * =========================================
     */
    private void registrarChofer(
            UsuarioCreateDTO dto,
            Usuario usuario) {

        if (dto.getNumeroLicencia() == null
                || dto.getNumeroLicencia().isBlank()) {

            throw new BusinessException(
                    "Debe ingresar el número de licencia."
            );

        }

        if (choferRepository.existsByNumeroLicencia(
                dto.getNumeroLicencia())) {

            throw new BusinessException(
                    "La licencia ya existe."
            );

        }

        Chofer chofer = Chofer.builder()
                .usuario(usuario)
                .numeroLicencia(dto.getNumeroLicencia())
                .categoriaLicencia(dto.getCategoriaLicencia())
                .fechaVencimiento(dto.getFechaVencimiento())
                .estado(true)
                .build();

        choferRepository.save(chofer);

    }
        @Transactional
        @Override
    public UsuarioResponseDTO actualizar(Long id,
                                         UsuarioUpdateDTO dto) {




        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));


                //=========================================
        // NORMALIZAR DATOS
        //=========================================

        dto.setCodigo(dto.getCodigo().trim().toUpperCase());
        dto.setCorreo(dto.getCorreo().trim().toLowerCase());

        //=========================================
        // VALIDAR CÓDIGO
        //=========================================

        if (!usuario.getCodigo().equals(dto.getCodigo())
                && usuarioRepository.existsByCodigo(dto.getCodigo())) {

            throw new BusinessException(
                    "El código ya existe."
            );

        }

        //=========================================
        // VALIDAR CORREO
        //=========================================

        if (!usuario.getCorreo().equals(dto.getCorreo())
                && usuarioRepository.existsByCorreo(dto.getCorreo())) {

            throw new BusinessException(
                    "El correo ya existe."
            );

        }

        //=========================================
        // BUSCAR ROL
        //=========================================

        Rol rol = rolRepository.findById(dto.getIdRol())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Rol no encontrado."
                        ));

        //=========================================
        // ACTUALIZAR USUARIO
        //=========================================

        usuario.setCodigo(dto.getCodigo().trim().toUpperCase());
        usuario.setNombres(dto.getNombres());
        usuario.setApellidos(dto.getApellidos());
        usuario.setCorreo(dto.getCorreo().trim().toLowerCase());
        usuario.setTelefono(dto.getTelefono());
        usuario.setEstado(dto.getEstado());
        usuario.setRol(rol);

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            usuario.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }

        Usuario actualizado = usuarioRepository.save(usuario);

        return usuarioMapper.toResponseDTO(actualizado);

    }

    @Override
    @Transactional
    public void eliminar(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));

        //=========================================
        // ELIMINAR REGISTROS RELACIONADOS
        //=========================================

        alumnoRepository.findByUsuario(usuario)
                .ifPresent(alumnoRepository::delete);

        choferRepository.findByUsuario_IdUsuario(id)
                .ifPresent(choferRepository::delete);

        //=========================================
        // ELIMINAR USUARIO
        //=========================================

        usuarioRepository.delete(usuario);

    }

}