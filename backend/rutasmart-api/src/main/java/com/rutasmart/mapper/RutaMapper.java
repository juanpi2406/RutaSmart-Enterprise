package com.rutasmart.mapper;

import com.rutasmart.dto.RutaDTO;
import com.rutasmart.entity.Ruta;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

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

    /** Campo virtual en API: no existe columna sede en Supabase. */
    @AfterMapping
    default void completarSede(Ruta entity, @MappingTarget RutaDTO dto) {
        if (dto.getSede() == null || dto.getSede().isBlank()) {
            dto.setSede(entity.getOrigen());
        }
    }

}