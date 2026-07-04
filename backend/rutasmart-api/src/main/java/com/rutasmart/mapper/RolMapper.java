package com.rutasmart.mapper;

import com.rutasmart.dto.RolDTO;
import com.rutasmart.entity.Rol;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RolMapper {

    RolDTO toDTO(Rol entity);

    Rol toEntity(RolDTO dto);

    List<RolDTO> toDTOList(List<Rol> entityList);

}