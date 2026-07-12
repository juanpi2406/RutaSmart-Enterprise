package com.rutasmart.backend.service;

import com.rutasmart.backend.model.Bus;
import com.rutasmart.backend.model.Incidencia;
import com.rutasmart.backend.model.Reserva;
import com.rutasmart.backend.model.Usuario;
import com.rutasmart.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final UsuarioRepository usuarioRepository;
    private final ReservaRepository reservaRepository;
    private final BusRepository busRepository;
    private final IncidenciaRepository incidenciaRepository;

    public Map<String, Object> resumen() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Reserva> reservas = reservaRepository.findAll();
        List<Bus> buses = busRepository.findAll();
        List<Incidencia> incidencias = incidenciaRepository.findAll();

        long confirmadas = reservas.stream().filter(r -> "CONFIRMADA".equals(r.getEstado())).count();
        long pendientes = reservas.stream().filter(r -> "PENDIENTE".equals(r.getEstado())).count();
        long canceladas = reservas.stream().filter(r -> "CANCELADA".equals(r.getEstado())).count();

        Map<String, Long> porRuta = reservas.stream()
                .collect(Collectors.groupingBy(Reserva::getRuta, Collectors.counting()));

        Map<String, Object> resumen = new LinkedHashMap<>();
        resumen.put("totalUsuarios", usuarios.size());
        resumen.put("totalReservas", reservas.size());
        resumen.put("totalBuses", buses.size());
        resumen.put("totalIncidencias", incidencias.size());
        resumen.put("reservasConfirmadas", confirmadas);
        resumen.put("reservasPendientes", pendientes);
        resumen.put("reservasCanceladas", canceladas);
        resumen.put("reservasPorRuta", porRuta);

        long operativos = buses.stream().filter(b -> "DISPONIBLE".equals(b.getEstado())).count();
        long enRuta = buses.stream().filter(b -> "EN_RUTA".equals(b.getEstado())).count();
        long mantenimiento = buses.stream().filter(b -> "MANTENIMIENTO".equals(b.getEstado())).count();
        resumen.put("flota", Map.of("operativos", operativos, "enRuta", enRuta, "mantenimiento", mantenimiento));

        return resumen;
    }
}
