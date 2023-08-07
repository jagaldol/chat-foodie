package net.chatfoodie.server.chat.service;

import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception500;
import net.chatfoodie.server.chat.handler.FoodieWebSocketHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.*;


@Slf4j
public class FoodieWebSocketService {

    final private WebSocketClient webSocketClient = new StandardWebSocketClient();

    private final String serverUri;

    final private FoodieWebSocketHandler foodieWebSocketHandler = new FoodieWebSocketHandler();

    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    public FoodieWebSocketService(String serverUri) {
        this.serverUri = serverUri;
    }


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

        Future<?> future = executorService.submit(() -> {
            long startTime = System.currentTimeMillis();
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    String message = foodieWebSocketHandler.receiveMessage(); // 메시지를 받음 (메시지가 없으면 대기)
                    TextMessage textMessage = new TextMessage(message);
                    // 메시지 처리 로직 작성
                    users.forEach(user -> {
                        try {
                            user.sendMessage(textMessage);
                        } catch (IOException e) {
                            log.info("챗봇의 답변 전달 중 오류가 발생했습니다.");
                        }
                    });

                    if (foodieWebSocketHandler.isStreamEndEvent(message)) {
                        break;
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt(); // InterruptedException을 받으면 쓰레드 interrupt 상태를 설정하여 종료
                }
            }
            log.debug("쓰레드 종료됨");
        });

        try {
            // 10분 후에 쓰레드 종료
            future.get(10, TimeUnit.MINUTES);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            future.cancel(true); // 예외 발생 시 쓰레드 강제 종료
        }

        executorService.shutdown();
    }
}