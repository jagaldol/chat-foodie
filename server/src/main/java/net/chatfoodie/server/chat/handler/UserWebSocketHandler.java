package net.chatfoodie.server.chat.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server.chat.dto.ChatUserRequest;
import net.chatfoodie.server.chat.service.UserWebSocketService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class UserWebSocketHandler extends TextWebSocketHandler {

    private final UserWebSocketService userWebSocketService;

    private final Map<WebSocketSession, ChatSessionInfo> chatSessions = new ConcurrentHashMap<>();

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    private final ObjectMapper om;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 클라이언트가 채팅방에 입장 요청 시, 사용자와 채팅방을 매칭하여 저장
        String sessionId = session.getId(); // 사용자 ID를 적절히 설정 (세션 ID를 사용할 수도 있음)
        String chatSessionId = "chatSession_" + sessionId; // 개별적인 채팅방 ID를 설정 (예: chatRoom_userId)
        chatSessions.put(session, new ChatSessionInfo(chatSessionId));
        log.info(session + "클라이언트 접속");
    }

    public UserWebSocketHandler(UserWebSocketService userWebSocketService, ObjectMapper om) {
        this.userWebSocketService = userWebSocketService;
        this.om = om;
        scheduler.scheduleAtFixedRate(this::checkExpiredConnections, 1, 1, TimeUnit.SECONDS);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // TODO: pulbic-chat의 경우 하루 요청가능 횟수 제한 필요

        String payload = message.getPayload();
        log.info("받은 메시지 : " + payload);

        // Object 로 매핑
        ChatUserRequest.MessageDto messageDto;
        try {
            messageDto = om.readValue(payload, ChatUserRequest.MessageDto.class);
            if (!messageDto.validate()) {
                throw new RuntimeException("올바른 형식의 메시지가 아닙니다.");
            }
        } catch (Exception e) {
            log.info("올바른 형식의 메시지가 아닙니다.");
            session.close();
            return;
        }

        String chatSessionId = chatSessions.get(session).chatSessionId();
        var users = chatSessions.keySet().stream()
                .filter(s -> chatSessions.get(s).chatSessionId().equals(chatSessionId))
                .toList();

        userWebSocketService.requestToFoodie(messageDto, users);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info(session + " 클라이언트 접속 해제");
        chatSessions.remove(session);
    }

    private record ChatSessionInfo(
            String chatSessionId,
            Long expirationTime
    ) {
        private static final Long connectionTimeout = 10 * 60 * 1000L; // 10m

        public ChatSessionInfo(String chatRoomId) {
            this(chatRoomId, System.currentTimeMillis() + connectionTimeout);
        }

    }

    private void checkExpiredConnections() {
        long currentTime = System.currentTimeMillis();
        for (WebSocketSession session : chatSessions.keySet()) {
            ChatSessionInfo chatSessionInfo = chatSessions.get(session);
            long expirationTime = chatSessionInfo.expirationTime();
            if (expirationTime <= currentTime) {
                try {
                    session.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                chatSessions.remove(session);
            }
        }
    }
}
