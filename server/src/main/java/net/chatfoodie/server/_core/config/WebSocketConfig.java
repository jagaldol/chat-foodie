package net.chatfoodie.server._core.config;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server.chat.handler.UserWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@RequiredArgsConstructor
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final UserWebSocketHandler userWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(userWebSocketHandler, "/api/chat")
                .addHandler(userWebSocketHandler, "/api/public-chat")
                .setAllowedOrigins(Configs.CORS.toArray(new String[0])); // CORS 허용
    }
}
