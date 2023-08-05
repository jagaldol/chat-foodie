package net.chatfoodie.server.chat.service;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;

@Service
public class UserWebSocketService {

    public void requestToFoodie(String messageToSend, List<WebSocketSession> users) {
        // 메시지를 보내고 응답을 받습니다.

        FoodieWebSocketService foodieWebSocketService = new FoodieWebSocketService();
        foodieWebSocketService.sendMessage(messageToSend);
        foodieWebSocketService.listenForMessages(users);
    }
}
