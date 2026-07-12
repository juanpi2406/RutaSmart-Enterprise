package com.rutasmart.mapper;

import com.rutasmart.dto.request.ChoferCreateDTO;
import com.rutasmart.dto.request.ChoferUpdateDTO;
import com.rutasmart.dto.response.ChoferResponseDTO;
import com.rutasmart.entity.Chofer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChoferMapper {

    /*
     * ENTITY -> RESPONSE
     */

    @Mapping(source = "usuario.idUsuario", target = "idUsuario")
    @Mapping(source = "usuario.codigo", target = "codigo")
    @Mapping(source = "usuario.nombres", target = "nombres")
    @Mapping(source = "usuario.apellidos", target = "apellidos")
    @Mapping(source = "usuario.correo", target = "correo")
    @Mapping(source = "usuario.telefono", target = "telefono")
    ChoferResponseDTO toResponseDTO(Chofer chofer);

    /*
     * CREATE DTO -> ENTITY
     */

    @Mapping(target = "idChofer", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "viajes", ignore = true)
    @Mapping(target = "asignaciones", ignore = true)
    Chofer toEntity(ChoferCreateDTO dto);

    /*
     * UPDATE DTO -> ENTITY
     */

    @Mapping(target = "idChofer", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "viajes", ignore = true)
    @Mapping(target = "asignaciones", ignore = true)
    Chofer toEntity(ChoferUpdateDTO dto);

    /*
     * LIST
     */

    List<ChoferResponseDTO> toResponseDTOList(List<Chofer> choferes);

    void updateEntity(ChoferUpdateDTO dto, @MappingTarget Chofer entity);

}
