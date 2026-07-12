package com.rutasmart.mapper;

import com.rutasmart.dto.IncidenciaDTO;
import com.rutasmart.entity.Incidencia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IncidenciaMapper {

    @Mapping(source="usuario.idUsuario",target="idUsuario")
    @Mapping(source="viaje.idViaje",target="idViaje")
    IncidenciaDTO toDTO(Incidencia entity);

    @Mapping(target="usuario",ignore=true)
    @Mapping(target="viaje",ignore=true)
    Incidencia toEntity(IncidenciaDTO dto);

    List<IncidenciaDTO> toDTOList(List<Incidencia> entityList);

    List<Incidencia> toEntityList(List<IncidenciaDTO> dtoList);

}
