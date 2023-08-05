package net.chatfoodie.server.chat.service;

import net.chatfoodie.server._core.errors.exception.Exception500;
import net.chatfoodie.server.chat.handler.FoodieWebSocketHandler;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;

import java.io.IOException;
import java.util.List;


@Service
public class FoodieWebSocketService {

    final private WebSocketClient webSocketClient = new StandardWebSocketClient();

    final private String serverUri = "wss://microsoft-ncaa-stocks-arbitrary.trycloudflare.com/api/v1/chat-stream";

    final private FoodieWebSocketHandler foodieWebSocketHandler = new FoodieWebSocketHandler();


    public void sendMessage(String message) {
        try {
            // 서버로 메시지 전송
            WebSocketSession session = webSocketClient.execute(foodieWebSocketHandler, serverUri).get();
            session.sendMessage(new TextMessage(message));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void listenForMessages(List<WebSocketSession> users) {
        new Thread(() -> {
            while (true) {
                try {
                    String message = foodieWebSocketHandler.receiveMessage(); // 메시지를 받음 (메시지가 없으면 대기)
                    TextMessage textMessage = new TextMessage(message);
                    // 메시지 처리 로직 작성
                    users.forEach(user -> {
                        try {
                            user.sendMessage(textMessage);
                        } catch (IOException e) {
                            throw new Exception500("답변 전달 중 오류가 발생했습니다.");
                        }
                    });
                } catch (InterruptedException e) {
                    throw new Exception500("챗봇과의 통신 중 오류가 발생했습니다.");
                }
            }
        }).start();
    }
}