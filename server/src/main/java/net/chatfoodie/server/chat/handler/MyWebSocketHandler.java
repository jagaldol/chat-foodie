package net.chatfoodie.server.chat.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.LinkedBlockingQueue;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private final BlockingQueue<String> messageQueue = new LinkedBlockingQueue<>();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            String receivedMessage = message.getPayload();
            messageQueue.put(receivedMessage); // 받은 메시지를 큐에 추가
            if (isStreamEndEvent(receivedMessage)) {
                try {
                    session.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public String receiveMessage() throws InterruptedException {
        return messageQueue.take(); // 큐에서 메시지를 가져옴 (메시지가 없으면 대기)
    }

    private boolean isStreamEndEvent(String message) {
        // 메시지가 JSON 형식인 경우 파싱하여 이벤트를 확인합니다.
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(message);
            if (jsonNode.has("event") && "stream_end".equals(jsonNode.get("event").asText())) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}