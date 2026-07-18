package com.rutasmart.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rutasmart.dto.PuntoRutaDTO;
import com.rutasmart.dto.RutaGeometriaDTO;
import com.rutasmart.entity.Paradero;
import com.rutasmart.entity.Ruta;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.repository.ParaderoRepository;
import com.rutasmart.repository.RutaRepository;
import com.rutasmart.service.interfaces.RutaGeometriaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RutaGeometriaServiceImpl implements RutaGeometriaService {

    private static final String OSRM_BASE = "https://router.project-osrm.org/route/v1/driving/";

    private final RutaRepository rutaRepository;
    private final ParaderoRepository paraderoRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /** Cache en memoria (sin columna geometria_cache en Supabase). */
    private final ConcurrentHashMap<Long, String> cacheGeometria = new ConcurrentHashMap<>();

    @Override
    public void invalidarCache(Long idRuta) {
        if (idRuta != null) {
            cacheGeometria.remove(idRuta);
        }
    }

    @Override
    public RutaGeometriaDTO obtenerGeometria(Long idRuta) {
        Ruta ruta = rutaRepository.findById(idRuta)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta no encontrada."));

        List<Paradero> paraderos = paraderoRepository.findByRutaOrderByOrdenAsc(ruta).stream()
                .filter(p -> Boolean.TRUE.equals(p.getEstado()))
                .sorted(Comparator.comparingInt(Paradero::getOrden))
                .collect(Collectors.toList());

        List<PuntoRutaDTO> marcadores = construirMarcadores(paraderos, ruta);

        if (marcadores.size() < 2) {
            return RutaGeometriaDTO.builder()
                    .idRuta(ruta.getIdRuta())
                    .codigo(ruta.getCodigo())
                    .nombre(ruta.getNombre())
                    .origen(ruta.getOrigen())
                    .destino(ruta.getDestino())
                    .mapeable(false)
                    .mensaje("Se requieren al menos 2 paraderos con coordenadas GPS.")
                    .marcadores(marcadores)
                    .puntos(List.of())
                    .build();
        }

        List<PuntoRutaDTO> puntos = leerCache(ruta.getIdRuta());
        if (puntos == null || puntos.size() < 2) {
            puntos = calcularPolilineaOsrm(marcadores);
            if (puntos.size() < 2) {
                puntos = copiarMarcadoresComoTrayecto(marcadores);
            } else {
                guardarCache(ruta.getIdRuta(), puntos);
            }
        }

        return RutaGeometriaDTO.builder()
                .idRuta(ruta.getIdRuta())
                .codigo(ruta.getCodigo())
                .nombre(ruta.getNombre())
                .origen(ruta.getOrigen())
                .destino(ruta.getDestino())
                .mapeable(true)
                .mensaje(null)
                .marcadores(marcadores)
                .puntos(puntos)
                .build();
    }

    private List<PuntoRutaDTO> construirMarcadores(List<Paradero> paraderos, Ruta ruta) {
        List<PuntoRutaDTO> marcadores = new ArrayList<>();
        List<Paradero> georef = paraderos.stream()
                .filter(this::tieneCoordenadas)
                .collect(Collectors.toList());

        if (georef.isEmpty()) {
            return marcadores;
        }

        int numeroParadero = 0;
        for (int i = 0; i < georef.size(); i++) {
            Paradero p = georef.get(i);
            String tipo;
            if (i == 0) {
                tipo = "origen";
            } else if (i == georef.size() - 1) {
                tipo = "destino";
            } else {
                tipo = "paradero";
                numeroParadero++;
            }

            marcadores.add(PuntoRutaDTO.builder()
                    .lat(p.getLatitud().doubleValue())
                    .lng(p.getLongitud().doubleValue())
                    .etiqueta(p.getNombre() != null ? p.getNombre() : "Paradero " + p.getOrden())
                    .tipo(tipo)
                    .numero(tipo.equals("paradero") ? numeroParadero : null)
                    .build());
        }

        if (marcadores.size() == 1) {
            marcadores.add(PuntoRutaDTO.builder()
                    .lat(marcadores.get(0).getLat())
                    .lng(marcadores.get(0).getLng())
                    .etiqueta(ruta.getDestino() != null ? ruta.getDestino() : "Destino")
                    .tipo("destino")
                    .build());
        }

        return marcadores;
    }

    private boolean tieneCoordenadas(Paradero p) {
        return p.getLatitud() != null && p.getLongitud() != null
                && p.getLatitud().compareTo(BigDecimal.ZERO) != 0
                && p.getLongitud().compareTo(BigDecimal.ZERO) != 0;
    }

    private List<PuntoRutaDTO> calcularPolilineaOsrm(List<PuntoRutaDTO> marcadores) {
        try {
            String coords = marcadores.stream()
                    .map(p -> p.getLng() + "," + p.getLat())
                    .collect(Collectors.joining(";"));

            String url = OSRM_BASE + coords + "?overview=full&geometries=geojson&steps=false";
            String json = restTemplate.getForObject(url, String.class);
            if (json == null) {
                return List.of();
            }

            JsonNode root = objectMapper.readTree(json);
            if (!"Ok".equalsIgnoreCase(root.path("code").asText())) {
                log.warn("OSRM respondió con código: {}", root.path("code").asText());
                return List.of();
            }

            JsonNode coordinates = root.path("routes").path(0).path("geometry").path("coordinates");
            if (!coordinates.isArray() || coordinates.isEmpty()) {
                return List.of();
            }

            List<PuntoRutaDTO> puntos = new ArrayList<>();
            for (JsonNode coord : coordinates) {
                double lng = coord.get(0).asDouble();
                double lat = coord.get(1).asDouble();
                puntos.add(PuntoRutaDTO.builder()
                        .lat(lat)
                        .lng(lng)
                        .etiqueta("")
                        .tipo("trayecto")
                        .build());
            }

            if (!puntos.isEmpty()) {
                PuntoRutaDTO primero = marcadores.get(0);
                PuntoRutaDTO ultimo = marcadores.get(marcadores.size() - 1);
                puntos.get(0).setEtiqueta(primero.getEtiqueta());
                puntos.get(0).setTipo(primero.getTipo());
                puntos.get(0).setNumero(primero.getNumero());
                PuntoRutaDTO fin = puntos.get(puntos.size() - 1);
                fin.setEtiqueta(ultimo.getEtiqueta());
                fin.setTipo(ultimo.getTipo());
                fin.setNumero(ultimo.getNumero());
            }

            return puntos;
        } catch (Exception ex) {
            log.warn("No se pudo calcular ruta OSRM: {}", ex.getMessage());
            return List.of();
        }
    }

    private List<PuntoRutaDTO> copiarMarcadoresComoTrayecto(List<PuntoRutaDTO> marcadores) {
        return marcadores.stream()
                .map(m -> PuntoRutaDTO.builder()
                        .lat(m.getLat())
                        .lng(m.getLng())
                        .etiqueta(m.getEtiqueta())
                        .tipo(m.getTipo())
                        .numero(m.getNumero())
                        .build())
                .collect(Collectors.toList());
    }

    private List<PuntoRutaDTO> leerCache(Long idRuta) {
        String raw = cacheGeometria.get(idRuta);
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            PuntoRutaDTO[] arr = objectMapper.readValue(raw, PuntoRutaDTO[].class);
            return List.of(arr);
        } catch (Exception ex) {
            log.warn("Cache geometría inválida ruta {}: {}", idRuta, ex.getMessage());
            return null;
        }
    }

    private void guardarCache(Long idRuta, List<PuntoRutaDTO> puntos) {
        try {
            cacheGeometria.put(idRuta, objectMapper.writeValueAsString(puntos));
        } catch (Exception ex) {
            log.warn("No se pudo guardar cache geometría en memoria: {}", ex.getMessage());
        }
    }
}
