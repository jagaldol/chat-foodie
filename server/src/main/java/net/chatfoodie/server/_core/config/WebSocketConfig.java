package net.chatfoodie.server._core.config;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server.chat.handler.UserWebSocketApiHandler;
import net.chatfoodie.server.chat.handler.UserWebSocketBaseHandler;
import net.chatfoodie.server.chat.handler.UserWebSocketPublicApiHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@RequiredArgsConstructor
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final UserWebSocketApiHandler userWebSocketApiHandler;

    private final UserWebSocketPublicApiHandler userWebSocketPublicApiHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(userWebSocketApiHandler, "/api/chat")
                .addHandler(userWebSocketPublicApiHandler, "/api/public-chat")
                .setAllowedOrigins(Configs.CORS.toArray(new String[0])); // CORS 허용
    }
}
