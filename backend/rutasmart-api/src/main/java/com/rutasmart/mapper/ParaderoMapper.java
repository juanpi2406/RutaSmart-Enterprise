package com.rutasmart.mapper;

import com.rutasmart.dto.ParaderoDTO;
import com.rutasmart.entity.Paradero;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ParaderoMapper {

    /**
     * Entity -> DTO
     */
    @Mapping(source = "ruta.idRuta", target = "idRuta")
    ParaderoDTO toDTO(Paradero entity);

    /**
     * DTO -> Entity
     */
    @Mapping(target = "ruta", ignore = true)
    @Mapping(target = "reservas", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Paradero toEntity(ParaderoDTO dto);

    /**
     * Lista Entity -> Lista DTO
     */
    List<ParaderoDTO> toDTOList(List<Paradero> entityList);

    /**
     * Lista DTO -> Lista Entity
     */
    List<Paradero> toEntityList(List<ParaderoDTO> dtoList);

}