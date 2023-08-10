package net.chatfoodie.server.chat.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server.chat.dto.ChatFoodieRequest;
import net.chatfoodie.server.chat.dto.ChatUserRequest;
import net.chatfoodie.server.chat.service.UserWebSocketService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

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
        Long userId = userWebSocketService.getUserId(session);

        return userWebSocketService.makeFoodieRequestDto(
                (ChatUserRequest.MessageDto) messageDto, userId
        );
    }

    @Override
    protected void requestToFoodie(ChatUserRequest.MessageDtoInterface messageDtoInterface, ChatFoodieRequest.MessageDto foodieMessageDto, WebSocketSession session) throws IOException {
        var userMessageDto = (ChatUserRequest.MessageDto) messageDtoInterface;
        userWebSocketService.requestToFoodie(foodieMessageDto, session, userMessageDto.chatroomId());
    }
}
