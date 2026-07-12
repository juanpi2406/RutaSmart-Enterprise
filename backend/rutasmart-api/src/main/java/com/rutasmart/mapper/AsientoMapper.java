package com.rutasmart.mapper;

import com.rutasmart.dto.AsientoDTO;
import com.rutasmart.entity.Asiento;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AsientoMapper {

    AsientoDTO toDTO(Asiento entity);

    Asiento toEntity(AsientoDTO dto);

    List<AsientoDTO> toDTOList(List<Asiento> entityList);

    List<Asiento> toEntityList(List<AsientoDTO> dtoList);

}
