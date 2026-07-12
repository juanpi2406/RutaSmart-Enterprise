package com.rutasmart.mapper;

import com.rutasmart.dto.AlumnoDTO;
import com.rutasmart.entity.Alumno;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AlumnoMapper {

    @Mapping(source = "usuario.idUsuario", target = "idUsuario")
    AlumnoDTO toDTO(Alumno entity);

    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Alumno toEntity(AlumnoDTO dto);

    List<AlumnoDTO> toDTOList(List<Alumno> entityList);

    List<Alumno> toEntityList(List<AlumnoDTO> dtoList);

}