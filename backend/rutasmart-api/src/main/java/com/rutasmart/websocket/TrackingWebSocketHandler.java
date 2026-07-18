package com.rutasmart.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class TrackingWebSocketHandler extends TextWebSocketHandler {

    private final TrackingBroadcastService broadcastService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        broadcastService.registrar(session.getId(), session);
        try {
            session.sendMessage(new TextMessage("{\"tipo\":\"CONNECTED\",\"data\":true}"));
        } catch (Exception ignored) { }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        broadcastService.eliminar(session.getId());
    }
}
