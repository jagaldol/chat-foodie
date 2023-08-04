package net.chatfoodie.server.chat.service;

import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server.chat.WebsocketClient;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Slf4j
@Service
public class ChatService {

    public void requestToFoodie(String messageToSend, List<WebSocketSession> users) {
        try {
            // 다른 WebSocket 서버의 URI를 설정합니다.
            URI serverUri = new URI("wss://microsoft-ncaa-stocks-arbitrary.trycloudflare.com/api/v1/chat-stream");

            WebsocketClient webSocketClient = new WebsocketClient(serverUri);

            // 메시지를 보내고 응답을 받습니다.
            webSocketClient.sendMessage(messageToSend);
            webSocketClient.listenForMessages(users);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }
}
