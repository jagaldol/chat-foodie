package net.chatfoodie.server.chat.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.chatfoodie.server.chat.service.UserWebSocketService;
import org.springframework.stereotype.Component;

@Component
public class UserWebSocketPublicApiHandler extends UserWebSocketBaseHandler {

    public UserWebSocketPublicApiHandler(UserWebSocketService userWebSocketService, ObjectMapper om) {
        super(userWebSocketService, om);
    }
}
