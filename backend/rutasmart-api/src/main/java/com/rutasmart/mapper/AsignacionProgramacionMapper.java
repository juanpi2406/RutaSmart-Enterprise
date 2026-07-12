package com.rutasmart.mapper;

import com.rutasmart.dto.AsignacionProgramacionDTO;
import com.rutasmart.entity.AsignacionProgramacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AsignacionProgramacionMapper {

    /**
     * Entity -> DTO
     */
    @Mapping(source = "programacion.idProgramacion", target = "idProgramacion")
    @Mapping(source = "bus.idBus", target = "idBus")
    @Mapping(source = "chofer.idChofer", target = "idChofer")
    AsignacionProgramacionDTO toDTO(AsignacionProgramacion entity);

    /**
     * DTO -> Entity
     */
    @Mapping(target = "programacion", ignore = true)
    @Mapping(target = "bus", ignore = true)
    @Mapping(target = "chofer", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    AsignacionProgramacion toEntity(AsignacionProgramacionDTO dto);

    /**
     * Lista Entity -> Lista DTO
     */
    List<AsignacionProgramacionDTO> toDTOList(List<AsignacionProgramacion> entityList);

    /**
     * Lista DTO -> Lista Entity
     */
    List<AsignacionProgramacion> toEntityList(List<AsignacionProgramacionDTO> dtoList);

}