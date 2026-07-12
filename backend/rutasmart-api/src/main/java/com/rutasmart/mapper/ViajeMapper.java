package com.rutasmart.mapper;

import com.rutasmart.dto.ViajeDTO;
import com.rutasmart.entity.Viaje;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ViajeMapper {

    /**
     * Entity -> DTO
     */
    @Mapping(source = "programacion.idProgramacion", target = "idProgramacion")
    @Mapping(source = "bus.idBus", target = "idBus")
    @Mapping(source = "chofer.idChofer", target = "idChofer")
    ViajeDTO toDTO(Viaje entity);

    /**
     * DTO -> Entity
     */
    @Mapping(target = "programacion", ignore = true)
    @Mapping(target = "bus", ignore = true)
    @Mapping(target = "chofer", ignore = true)
    @Mapping(target = "reservas", ignore = true)
    @Mapping(target = "ubicaciones", ignore = true)
    @Mapping(target = "incidencias", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Viaje toEntity(ViajeDTO dto);

    /**
     * Lista Entity -> Lista DTO
     */
    List<ViajeDTO> toDTOList(List<Viaje> entityList);

    /**
     * Lista DTO -> Lista Entity
     */
    List<Viaje> toEntityList(List<ViajeDTO> dtoList);

}