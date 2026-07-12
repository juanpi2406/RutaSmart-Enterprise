package com.rutasmart.mapper;

import com.rutasmart.dto.ReservaDTO;
import com.rutasmart.entity.Reserva;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReservaMapper {

    /**
     * Entity -> DTO
     */
    @Mapping(source = "alumno.idAlumno", target = "idAlumno")
    @Mapping(source = "viaje.idViaje", target = "idViaje")
    @Mapping(source = "paradero.idParadero", target = "idParadero")
    ReservaDTO toDTO(Reserva entity);

    /**
     * DTO -> Entity
     */
    @Mapping(target = "alumno", ignore = true)
    @Mapping(target = "viaje", ignore = true)
    @Mapping(target = "paradero", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Reserva toEntity(ReservaDTO dto);

    /**
     * Lista Entity -> Lista DTO
     */
    List<ReservaDTO> toDTOList(List<Reserva> entityList);

    /**
     * Lista DTO -> Lista Entity
     */
    List<Reserva> toEntityList(List<ReservaDTO> dtoList);

}