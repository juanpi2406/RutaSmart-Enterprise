package com.rutasmart.service.interfaces;

import com.rutasmart.dto.RutaGeometriaDTO;

public interface RutaGeometriaService {

    RutaGeometriaDTO obtenerGeometria(Long idRuta);

    void invalidarCache(Long idRuta);
}
