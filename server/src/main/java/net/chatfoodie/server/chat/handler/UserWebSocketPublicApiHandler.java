package net.chatfoodie.server.chat.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.chatfoodie.server.chat.dto.ChatFoodieRequest;
import net.chatfoodie.server.chat.dto.ChatUserRequest;
import net.chatfoodie.server.chat.service.UserWebSocketService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class UserWebSocketPublicApiHandler extends UserWebSocketBaseHandler {

    public UserWebSocketPublicApiHandler(UserWebSocketService userWebSocketService, ObjectMapper om) {
        super(userWebSocketService, om);
    }

    @Override
    protected ChatUserRequest.MessageDtoInterface toMessageDto(String payload) throws JsonProcessingException {
        return om.readValue(payload, ChatUserRequest.PublicMessageDto.class);
    }

    @Override
    protected ChatFoodieRequest.MessageDto toFoodieMessageDto(ChatUserRequest.MessageDtoInterface messageDto, WebSocketSession session) {

        return new ChatFoodieRequest.MessageDto((ChatUserRequest.PublicMessageDto) messageDto);
    }

    @Override
    protected void requestToFoodie(ChatUserRequest.MessageDtoInterface messageDtoInterface, ChatFoodieRequest.MessageDto foodieMessageDto, WebSocketSession session) {
        userWebSocketService.requestToFoodiePublic(foodieMessageDto, session);
    }
}
