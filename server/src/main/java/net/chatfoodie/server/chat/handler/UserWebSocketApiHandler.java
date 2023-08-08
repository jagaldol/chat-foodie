package net.chatfoodie.server.chat.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.security.CustomUserDetails;
import net.chatfoodie.server.chat.dto.ChatFoodieRequest;
import net.chatfoodie.server.chat.dto.ChatUserRequest;
import net.chatfoodie.server.chat.service.UserWebSocketService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Objects;

@Slf4j
@Component
public class UserWebSocketApiHandler extends UserWebSocketBaseHandler {
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
    }

    public UserWebSocketApiHandler(UserWebSocketService userWebSocketService, ObjectMapper om) {
        super(userWebSocketService, om);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("받은 메시지 : " + payload);

        // Object 로 매핑
        ChatUserRequest.MessageDto messageDto;
        try {
            messageDto = om.readValue(payload, ChatUserRequest.MessageDto.class);
            if (messageDto.notValidate()) {
                log.error("올바른 형식의 메시지가 아닙니다.");
                throw new RuntimeException();
            }
        } catch (Exception e) {
            log.error("올바른 형식의 메시지가 아닙니다.");
            session.close();
            return;
        }


        Authentication authentication = (Authentication) session.getPrincipal();

        if (authentication == null) {
            log.error("인증 정보가 없는 접근입니다.");
            session.close();
            return;
        }
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        Long userId = customUserDetails.getId();


        ChatFoodieRequest.MessageDto foodieMessageDto;
        try {
            foodieMessageDto = userWebSocketService.toFoodieRequestDto(messageDto, userId);
        } catch (Exception e) {
            log.error("잘못된 입력입니다.");
            session.close();
            return;
        }

        String chatSessionId = chatSessions.get(session).chatSessionId();
        var users = chatSessions.keySet().stream()
                .filter(s -> chatSessions.get(s).chatSessionId().equals(chatSessionId))
                .toList();



        userWebSocketService.requestToFoodie(foodieMessageDto, users);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
    }
}
