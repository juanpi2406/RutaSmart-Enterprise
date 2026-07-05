package com.rutasmart.mapper;

import com.rutasmart.dto.RolDTO;
import com.rutasmart.entity.Rol;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RolMapper {

    RolDTO toDTO(Rol entity);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "usuarios", ignore = true)
    Rol toEntity(RolDTO dto);

    List<RolDTO> toDTOList(List<Rol> entityList);

    // 👇 AGREGA ESTE MÉTODO AQUÍ ABAJO
    @Mapping(target = "idRol", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "usuarios", ignore = true)
    void updateEntity(RolDTO dto, @MappingTarget Rol entity);

}