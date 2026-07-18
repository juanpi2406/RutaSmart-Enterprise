package com.rutasmart.service.impl;

import com.rutasmart.dto.EtaDTO;
import com.rutasmart.entity.Paradero;
import com.rutasmart.entity.Reserva;
import com.rutasmart.entity.UbicacionBus;
import com.rutasmart.entity.Viaje;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.repository.ParaderoRepository;
import com.rutasmart.repository.ReservaRepository;
import com.rutasmart.repository.UbicacionBusRepository;
import com.rutasmart.repository.ViajeRepository;
import com.rutasmart.service.interfaces.EtaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EtaServiceImpl implements EtaService {

    private static final double VELOCIDAD_KMH = 28.0;

    private final ViajeRepository viajeRepository;
    private final ParaderoRepository paraderoRepository;
    private final UbicacionBusRepository ubicacionBusRepository;
    private final ReservaRepository reservaRepository;

    @Override
    public EtaDTO calcularEta(Long idViaje, Long idParadero) {
        Viaje viaje = viajeRepository.findById(idViaje)
                .orElseThrow(() -> new ResourceNotFoundException("Viaje no encontrado."));

        Paradero destino = paraderoRepository.findById(idParadero)
                .orElseThrow(() -> new ResourceNotFoundException("Paradero no encontrado."));

        UbicacionBus ubicacion = ubicacionBusRepository
                .findFirstByViaje_IdViajeOrderByFechaHoraDesc(idViaje)
                .orElse(null);

        if (ubicacion == null) {
            return EtaDTO.builder()
                    .idViaje(idViaje)
                    .idParadero(idParadero)
                    .mensaje("El bus aún no ha iniciado transmisión GPS.")
                    .build();
        }

        double latBus = ubicacion.getLatitud().doubleValue();
        double lngBus = ubicacion.getLongitud().doubleValue();
        double latPar = destino.getLatitud().doubleValue();
        double lngPar = destino.getLongitud().doubleValue();

        double distancia = haversineM(latBus, lngBus, latPar, lngPar);
        int minutos = (int) Math.max(1, Math.round((distancia / 1000.0) / VELOCIDAD_KMH * 60));

        int paradasRestantes = calcularParadasRestantes(viaje, destino);

        return EtaDTO.builder()
                .idViaje(idViaje)
                .idParadero(idParadero)
                .minutosEstimados(minutos)
                .paradasRestantes(paradasRestantes)
                .distanciaMetros((double) Math.round(distancia))
                .mensaje("Llegada estimada en ~" + minutos + " min")
                .build();
    }

    private int calcularParadasRestantes(Viaje viaje, Paradero destino) {
        if (viaje.getProgramacion() == null || viaje.getProgramacion().getRuta() == null) {
            return 0;
        }
        List<Paradero> paraderos = paraderoRepository
                .findByRutaOrderByOrdenAsc(viaje.getProgramacion().getRuta());
        paraderos.sort(Comparator.comparingInt(Paradero::getOrden));
        int idxDestino = -1;
        for (int i = 0; i < paraderos.size(); i++) {
            if (paraderos.get(i).getIdParadero().equals(destino.getIdParadero())) {
                idxDestino = i;
                break;
            }
        }
        if (idxDestino < 0) return 0;

        UbicacionBus ubicacion = ubicacionBusRepository
                .findFirstByViaje_IdViajeOrderByFechaHoraDesc(viaje.getIdViaje())
                .orElse(null);
        if (ubicacion == null) return idxDestino;

        double latBus = ubicacion.getLatitud().doubleValue();
        double lngBus = ubicacion.getLongitud().doubleValue();
        int idxBus = 0;
        double minDist = Double.MAX_VALUE;
        for (int i = 0; i < paraderos.size(); i++) {
            Paradero p = paraderos.get(i);
            double d = haversineM(latBus, lngBus, p.getLatitud().doubleValue(), p.getLongitud().doubleValue());
            if (d < minDist) {
                minDist = d;
                idxBus = i;
            }
        }
        return Math.max(0, idxDestino - idxBus);
    }

    private double haversineM(double lat1, double lng1, double lat2, double lng2) {
        double R = 6371000;
        double toRad = Math.PI / 180;
        double dLat = (lat2 - lat1) * toRad;
        double dLng = (lng2 - lng1) * toRad;
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return 2 * R * Math.asin(Math.sqrt(a));
    }
}
