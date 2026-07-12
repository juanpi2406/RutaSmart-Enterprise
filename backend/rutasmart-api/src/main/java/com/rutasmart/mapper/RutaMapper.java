package com.rutasmart.mapper;

import com.rutasmart.dto.RutaDTO;
import com.rutasmart.entity.Ruta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RutaMapper {

    RutaDTO toDTO(Ruta entity);

    @Mapping(target = "paraderos", ignore = true)
    @Mapping(target = "programaciones", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Ruta toEntity(RutaDTO dto);

    List<RutaDTO> toDTOList(List<Ruta> entityList);

    List<Ruta> toEntityList(List<RutaDTO> dtoList);

}