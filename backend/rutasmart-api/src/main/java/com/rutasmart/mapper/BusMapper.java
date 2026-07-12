package com.rutasmart.mapper;

import com.rutasmart.dto.BusDTO;
import com.rutasmart.entity.Bus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BusMapper {

    BusDTO toDTO(Bus entity);

    @Mapping(target = "viajes", ignore = true)
    @Mapping(target = "asignaciones", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Bus toEntity(BusDTO dto);

    List<BusDTO> toDTOList(List<Bus> entityList);

    List<Bus> toEntityList(List<BusDTO> dtoList);

}