package com.rutasmart.mapper;

import com.rutasmart.dto.ProgramacionViajeDTO;
import com.rutasmart.entity.ProgramacionViaje;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProgramacionViajeMapper {

    /**
     * Entity -> DTO
     */
    @Mapping(source = "ruta.idRuta", target = "idRuta")
    ProgramacionViajeDTO toDTO(ProgramacionViaje entity);

    /**
     * DTO -> Entity
     */
    @Mapping(target = "ruta", ignore = true)
    @Mapping(target = "viajes", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProgramacionViaje toEntity(ProgramacionViajeDTO dto);

    /**
     * Lista Entity -> Lista DTO
     */
    List<ProgramacionViajeDTO> toDTOList(List<ProgramacionViaje> entityList);

    /**
     * Lista DTO -> Lista Entity
     */
    List<ProgramacionViaje> toEntityList(List<ProgramacionViajeDTO> dtoList);

}