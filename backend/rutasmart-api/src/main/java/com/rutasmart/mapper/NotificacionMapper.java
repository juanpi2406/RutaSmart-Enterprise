package com.rutasmart.mapper;

import com.rutasmart.dto.NotificacionDTO;
import com.rutasmart.entity.Notificacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificacionMapper {

    /**
     * Entity -> DTO
     */
    @Mapping(source = "usuario.idUsuario", target = "idUsuario")
    NotificacionDTO toDTO(Notificacion entity);

    /**
     * DTO -> Entity
     */
    @Mapping(target = "usuario", ignore = true)

    Notificacion toEntity(NotificacionDTO dto);

    /**
     * Lista Entity -> Lista DTO
     */
    List<NotificacionDTO> toDTOList(List<Notificacion> entityList);

    /**
     * Lista DTO -> Lista Entity
     */
    List<Notificacion> toEntityList(List<NotificacionDTO> dtoList);

}