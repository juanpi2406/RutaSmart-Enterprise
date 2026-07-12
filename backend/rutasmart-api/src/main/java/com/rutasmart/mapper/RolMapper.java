package com.rutasmart.mapper;

import com.rutasmart.dto.RolDTO;
import com.rutasmart.entity.Rol;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RolMapper {

    /**
     * Entity -> DTO
     */
    RolDTO toDTO(Rol entity);

<<<<<<< HEAD
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "usuarios", ignore = true)
=======
    /**
     * DTO -> Entity
     */
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
    Rol toEntity(RolDTO dto);

    /**
     * Lista Entity -> Lista DTO
     */
    List<RolDTO> toDTOList(List<Rol> entityList);

<<<<<<< HEAD
    // 👇 AGREGA ESTE MÉTODO AQUÍ ABAJO
    @Mapping(target = "idRol", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "usuarios", ignore = true)
    void updateEntity(RolDTO dto, @MappingTarget Rol entity);
=======
    /**
     * Lista DTO -> Lista Entity
     */
    List<Rol> toEntityList(List<RolDTO> dtoList);
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

}