package com.rutasmart.service.interfaces;

import com.rutasmart.dto.EtaDTO;

public interface EtaService {

    EtaDTO calcularEta(Long idViaje, Long idParadero);
}
