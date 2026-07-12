package com.rutasmart.mapper;

import com.rutasmart.dto.RolDTO;
import com.rutasmart.entity.Rol;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RolMapper {

    /**
     * Entity -> DTO
     */
    RolDTO toDTO(Rol entity);

    /**
     * DTO -> Entity
     */
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "usuarios", ignore = true)
    Rol toEntity(RolDTO dto);

    /**
     * Lista Entity -> Lista DTO
     */
    List<RolDTO> toDTOList(List<Rol> entityList);

    /**
     * Lista DTO -> Lista Entity
     */
    List<Rol> toEntityList(List<RolDTO> dtoList);

    /**
     * Actualiza una entidad existente a partir del DTO.
     */
    @Mapping(target = "idRol", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "usuarios", ignore = true)
    void updateEntity(RolDTO dto, @MappingTarget Rol entity);

}
