package com.rutasmart.backend;

import com.rutasmart.backend.model.*;
import com.rutasmart.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final BusRepository busRepository;
    private final ReservaRepository reservaRepository;
    private final IncidenciaRepository incidenciaRepository;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) return;

        usuarioRepository.save(new Usuario(null, "Juan Castillo", "juan@rutasmart.pe", "admin123", "ADMINISTRADOR", "ACTIVO", null, null, null, null));
        usuarioRepository.save(new Usuario(null, "Carlos Ruiz", "carlos@univ.pe", "alumno123", "ALUMNO", "ACTIVO", null, null, null, null));
        usuarioRepository.save(new Usuario(null, "María Soto", "maria@univ.pe", "alumno123", "ALUMNO", "ACTIVO", null, null, null, null));
        usuarioRepository.save(new Usuario(null, "José Díaz", "jose@univ.pe", "alumno123", "ALUMNO", "ACTIVO", null, null, null, null));
        usuarioRepository.save(new Usuario(null, "Miguel Díaz", "miguel@ruta.pe", "chofer123", "CHOFER", "VACACIONES", null, null, null, null));
        usuarioRepository.save(new Usuario(null, "Pedro López", "pedro@rutasmart.pe", "chofer123", "CHOFER", "ACTIVO", "74125896", "A-IIIB", "2028-12-15", "999 888 777"));

        busRepository.save(new Bus(null, "BUS-01", "ABC-123", "Ruta Norte", "Carlos Ruiz", "DISPONIBLE"));
        busRepository.save(new Bus(null, "BUS-02", "XYZ-852", "Ruta Sur", "Miguel Díaz", "EN_RUTA"));
        busRepository.save(new Bus(null, "BUS-03", "AAA-456", "Ruta Centro", "Pedro León", "MANTENIMIENTO"));

        reservaRepository.save(new Reserva(null, "Carlos Ruiz", "Norte", "2026-07-10", "07:00", "CONFIRMADA"));
        reservaRepository.save(new Reserva(null, "María Soto", "Centro", "2026-07-10", "08:00", "PENDIENTE"));
        reservaRepository.save(new Reserva(null, "José Díaz", "Sur", "2026-07-10", "09:00", "CONFIRMADA"));

        incidenciaRepository.save(new Incidencia(null, "Bus", "Retraso en salida programada - Ruta Norte", "2026-07-03", "Activa", "Supervisor"));
        incidenciaRepository.save(new Incidencia(null, "Bus", "Mal funcionamiento del aire acondicionado - BUS-01", "2026-07-01", "Resuelta", "Pedro López"));
        incidenciaRepository.save(new Incidencia(null, "Ruta", "Desvio de ruta por cierre de vía - Ruta Sur", "2026-06-28", "Resuelta", "Tráfico"));
        incidenciaRepository.save(new Incidencia(null, "Conductor", "Reclamo por exceso de velocidad", "2026-06-25", "En revision", "Pasajero"));
    }
}
