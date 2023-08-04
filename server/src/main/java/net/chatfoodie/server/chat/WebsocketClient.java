package net.chatfoodie.server.chat;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server.chat.handler.MyWebSocketHandler;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.concurrent.CountDownLatch;


public class WebsocketClient {

    private final WebSocketClient webSocketClient = new StandardWebSocketClient();

    private final URI serverUri;

    private final MyWebSocketHandler handler = new MyWebSocketHandler();

    public WebsocketClient(URI serverUri) {
        this.serverUri = serverUri;
    }

    public void start() {
        // WebSocket 클라이언트 초기화 등 필요한 작업 수행
        // 서버와의 연결이 필요한 경우 여기서 연결을 수립할 수 있습니다.
    }

    public void sendMessage(String message) {
        try {
            // 서버로 메시지 전송
            WebSocketSession session = webSocketClient.execute(handler, serverUri.toString()).get();
            session.sendMessage(new TextMessage(message));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void listenForMessages(List<WebSocketSession> users) {
        new Thread(() -> {
            while (true) {
                try {
                    String message = handler.receiveMessage(); // 메시지를 받음 (메시지가 없으면 대기)
                    TextMessage textMessage = new TextMessage(message);
                    users.forEach(user -> {
                        try {
                            user.sendMessage(textMessage);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    });
                    // 메시지 처리 로직 작성
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
//    public String sendMessageAndReceiveResponse(String message) {
//        try {
//            CountDownLatch latch = new CountDownLatch(1);
//            MyWebSocketHandler handler = new MyWebSocketHandler(latch);
//
//            WebSocketSession session = webSocketClient.execute(handler, serverUri.toString()).get();
//            session.sendMessage(new TextMessage(message));
//
//            latch.await(); // 응답을 기다림
//
//            String response = handler.getResponse();
//            session.close(); // 연결 종료
//
//            return response;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
}