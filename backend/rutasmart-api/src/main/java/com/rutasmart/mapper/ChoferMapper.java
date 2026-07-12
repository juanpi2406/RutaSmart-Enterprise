package com.rutasmart.mapper;

<<<<<<< HEAD
import com.rutasmart.dto.request.ChoferCreateDTO;
import com.rutasmart.dto.request.ChoferUpdateDTO;
import com.rutasmart.dto.response.ChoferResponseDTO;
import com.rutasmart.entity.Chofer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
=======
import com.rutasmart.dto.ChoferDTO;
import com.rutasmart.entity.Chofer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChoferMapper {

<<<<<<< HEAD
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
    Chofer toEntity(ChoferCreateDTO dto);

    /*
     * UPDATE DTO -> ENTITY
     */

    @Mapping(target = "idChofer", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Chofer toEntity(ChoferUpdateDTO dto);

    /*
     * LIST
     */

    List<ChoferResponseDTO> toResponseDTOList(List<Chofer> choferes);
    void updateEntity(ChoferUpdateDTO dto, @MappingTarget Chofer entity);
=======
    @Mapping(source = "usuario.idUsuario", target = "idUsuario")
    ChoferDTO toDTO(Chofer entity);

    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Chofer toEntity(ChoferDTO dto);

    List<ChoferDTO> toDTOList(List<Chofer> entityList);

    List<Chofer> toEntityList(List<ChoferDTO> dtoList);
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

}