package net.chatfoodie.server.chat.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception400;
import net.chatfoodie.server._core.errors.exception.Exception500;
import net.chatfoodie.server.chat.ChatSessionInfo;
import net.chatfoodie.server.chat.dto.ChatFoodieRequest;
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
public abstract class UserWebSocketBaseHandler extends TextWebSocketHandler {

    protected final UserWebSocketService userWebSocketService;

    protected final Map<WebSocketSession, ChatSessionInfo> chatSessions = new ConcurrentHashMap<>();

    protected final ObjectMapper om;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 클라이언트가 채팅방에 입장 요청 시, 사용자와 채팅방을 매칭하여 저장
        String sessionId = session.getId(); // 사용자 ID를 적절히 설정 (세션 ID를 사용할 수도 있음)
        String chatSessionId = "chatSession_" + sessionId; // 개별적인 채팅방 ID를 설정 (예: chatRoom_userId)
        chatSessions.put(session, new ChatSessionInfo(chatSessionId));
        log.info(session + "클라이언트 접속");
    }

    public UserWebSocketBaseHandler(UserWebSocketService userWebSocketService, ObjectMapper om) {
        this.userWebSocketService = userWebSocketService;
        this.om = om;
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(this::checkExpiredConnections, 1, 1, TimeUnit.SECONDS);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        String payload = message.getPayload();
        log.info("받은 메시지 : " + payload);

        // Object 로 매핑
        ChatUserRequest.MessageDtoInterface messageDtoInterface;
        try {
            messageDtoInterface = toMessageDto(payload);
            if (messageDtoInterface.notValidate()) {
                throw new RuntimeException();
            }
        } catch (Exception e) {
            session.sendMessage(userWebSocketService.createErrorMessage("올바른 형식의 메시지가 아닙니다."));
            session.close();
            return;
        }

        ChatFoodieRequest.MessageDto foodieMessageDto;
        try {
            foodieMessageDto = toFoodieMessageDto(messageDtoInterface, session);
        } catch (Exception e) {
            session.sendMessage(userWebSocketService.createErrorMessage("잘못된 입력입니다."));
            session.close();
            return;
        }

        try {
            requestToFoodie(messageDtoInterface, foodieMessageDto, session);
        } catch (Exception500 | Exception400 e) {
            session.sendMessage(userWebSocketService.createErrorMessage(e.getMessage()));
        } catch (JsonProcessingException e) {
            session.sendMessage(userWebSocketService.createErrorMessage("메시지 변환 중 오류가 발생했습니다."));
        } catch (Exception e) {
            session.sendMessage(userWebSocketService.createErrorMessage("챗봇에게 요청 중 오류가 발생했습니다."));
        } finally {
            session.close(); // 자동 세션 종료 시켜줌
        }
    }

    protected abstract ChatUserRequest.MessageDtoInterface toMessageDto(String payload) throws JsonProcessingException;


    protected abstract ChatFoodieRequest.MessageDto toFoodieMessageDto(ChatUserRequest.MessageDtoInterface messageDto, WebSocketSession session);

    protected abstract void requestToFoodie(ChatUserRequest.MessageDtoInterface messageDtoInterface, ChatFoodieRequest.MessageDto foodieMessageDto, WebSocketSession session) throws IOException;

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info(session + " 클라이언트 접속 해제");
        chatSessions.remove(session);
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
