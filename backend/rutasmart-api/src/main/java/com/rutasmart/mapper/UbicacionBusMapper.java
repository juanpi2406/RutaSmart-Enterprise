package com.rutasmart.mapper;

import com.rutasmart.dto.UbicacionBusDTO;
import com.rutasmart.entity.UbicacionBus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UbicacionBusMapper {

    @Mapping(source = "viaje.idViaje", target = "idViaje")
    UbicacionBusDTO toDTO(UbicacionBus entity);

    @Mapping(target = "viaje", ignore = true)
    UbicacionBus toEntity(UbicacionBusDTO dto);

    List<UbicacionBusDTO> toDTOList(List<UbicacionBus> entityList);

    List<UbicacionBus> toEntityList(List<UbicacionBusDTO> dtoList);

}