package net.chatfoodie.server.chat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserWebSocketService {

    final private FoodieWebSocketService foodieWebSocketService;

    public void requestToFoodie(String messageToSend, List<WebSocketSession> users) {
        // 메시지를 보내고 응답을 받습니다.
        foodieWebSocketService.sendMessage(messageToSend);
        foodieWebSocketService.listenForMessages(users);
    }
}
