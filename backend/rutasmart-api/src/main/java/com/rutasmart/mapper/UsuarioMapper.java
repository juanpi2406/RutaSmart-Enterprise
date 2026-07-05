package com.rutasmart.mapper;

import com.rutasmart.dto.UsuarioCreateDTO;
import com.rutasmart.dto.UsuarioResponseDTO;
import com.rutasmart.dto.UsuarioUpdateDTO;
import com.rutasmart.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    /*
     * ============================
     * Entity -> ResponseDTO
     * ============================
     */
    @Mapping(source = "rol.idRol", target = "idRol")
    @Mapping(source = "rol.nombre", target = "nombreRol")
    UsuarioResponseDTO toResponseDTO(Usuario usuario);

    /*
     * ============================
     * CreateDTO -> Entity
     * ============================
     */
    @Mapping(target = "idUsuario", ignore = true)
    @Mapping(target = "rol", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "ultimoLogin", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Usuario toEntity(UsuarioCreateDTO dto);

    /*
     * ============================
     * UpdateDTO -> Entity
     * ============================
     */
    @Mapping(target = "idUsuario", ignore = true)
    @Mapping(target = "rol", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "ultimoLogin", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Usuario toEntity(UsuarioUpdateDTO dto);

    /*
     * ============================
     * Lista Entity -> ResponseDTO
     * ============================
     */
    List<UsuarioResponseDTO> toResponseDTOList(List<Usuario> usuarios);
}