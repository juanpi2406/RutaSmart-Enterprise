package com.rutasmart.service;

import com.rutasmart.entity.Reserva;
import com.rutasmart.entity.UbicacionBus;
import com.rutasmart.entity.Viaje;
import com.rutasmart.repository.ReservaRepository;
import com.rutasmart.service.interfaces.EtaService;
import com.rutasmart.service.interfaces.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class ArrivalNotificationService {

    private final ReservaRepository reservaRepository;
    private final EtaService etaService;
    private final NotificacionService notificacionService;

    /** Evita duplicar avisos por reserva en la misma sesión JVM. */
    private final Set<Long> avisados = ConcurrentHashMap.newKeySet();

    @Transactional(readOnly = true)
    public void evaluarLlegada(UbicacionBus ubicacion) {
        if (ubicacion.getViaje() == null) return;
        Viaje viaje = ubicacion.getViaje();
        List<Reserva> reservas = reservaRepository.findByViaje_IdViajeAndEstadoNot(
                viaje.getIdViaje(), "CANCELADO");

        for (Reserva reserva : reservas) {
            if (reserva.getParadero() == null || reserva.getAlumno() == null) continue;
            if (avisados.contains(reserva.getIdReserva())) continue;

            var eta = etaService.calcularEta(viaje.getIdViaje(), reserva.getParadero().getIdParadero());
            if (eta.getParadasRestantes() != null && eta.getParadasRestantes() <= 2
                    && eta.getMinutosEstimados() != null) {
                Long idUsuario = reserva.getAlumno().getUsuario().getIdUsuario();
                notificacionService.enviar(
                        idUsuario,
                        "Tu bus se acerca",
                        "Faltan ~" + eta.getParadasRestantes() + " paradas (~"
                                + eta.getMinutosEstimados() + " min). Prepárate en "
                                + reserva.getParadero().getNombre() + ".",
                        "VIAJE"
                );
                avisados.add(reserva.getIdReserva());
            }
        }
    }
}
