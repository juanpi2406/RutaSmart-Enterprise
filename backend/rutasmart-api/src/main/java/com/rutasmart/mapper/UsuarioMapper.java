package com.rutasmart.mapper;

import com.rutasmart.dto.UsuarioDTO;
import com.rutasmart.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    /**
     * Entity -> DTO
     */
    @Mapping(source = "rol.idRol", target = "idRol")
    @Mapping(source = "rol.nombre", target = "nombreRol")
    UsuarioDTO toDTO(Usuario usuario);

    /**
     * DTO -> Entity
     */
    @Mapping(target = "rol", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "ultimoLogin", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Usuario toEntity(UsuarioDTO dto);

    /**
     * Lista Entity -> Lista DTO
     */
    List<UsuarioDTO> toDTOList(List<Usuario> usuarios);

    /**
     * Lista DTO -> Lista Entity
     */
    List<Usuario> toEntityList(List<UsuarioDTO> usuariosDTO);

}