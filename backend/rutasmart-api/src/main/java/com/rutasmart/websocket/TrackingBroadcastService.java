package com.rutasmart.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrackingBroadcastService {

    private final ObjectMapper objectMapper;
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public void registrar(String id, WebSocketSession session) {
        sessions.put(id, session);
    }

    public void eliminar(String id) {
        sessions.remove(id);
    }

    public void broadcast(String tipo, Object payload) {
        try {
            String json = objectMapper.writeValueAsString(Map.of("tipo", tipo, "data", payload));
            TextMessage msg = new TextMessage(json);
            sessions.values().forEach(session -> {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(msg);
                    } catch (Exception ex) {
                        log.debug("WS send error: {}", ex.getMessage());
                    }
                }
            });
        } catch (Exception ex) {
            log.warn("WS broadcast error: {}", ex.getMessage());
        }
    }
}
