package net.chatfoodie.server.chat.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.security.CustomUserDetails;
import net.chatfoodie.server.chat.dto.ChatFoodieRequest;
import net.chatfoodie.server.chat.dto.ChatUserRequest;
import net.chatfoodie.server.chat.service.UserWebSocketService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Slf4j
@Component
public class UserWebSocketApiHandler extends UserWebSocketBaseHandler {

    public UserWebSocketApiHandler(UserWebSocketService userWebSocketService, ObjectMapper om) {
        super(userWebSocketService, om);
    }
    @Override
    protected ChatUserRequest.MessageDtoInterface toMessageDto(String payload) throws JsonProcessingException {
        return om.readValue(payload, ChatUserRequest.MessageDto.class);
    }

    @Override
    protected ChatFoodieRequest.MessageDto toFoodieMessageDto(ChatUserRequest.MessageDtoInterface messageDto, WebSocketSession session) {
        Authentication authentication = (Authentication) session.getPrincipal();

        if (authentication == null) {
            throw new RuntimeException();
        }
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        Long userId = customUserDetails.getId();


        return userWebSocketService.makeFoodieRequestDto(
                (ChatUserRequest.MessageDto) messageDto, userId
        );
    }
}
