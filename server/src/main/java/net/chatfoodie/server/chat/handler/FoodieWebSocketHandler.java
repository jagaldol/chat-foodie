package net.chatfoodie.server.chat.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.chatfoodie.server._core.errors.exception.Exception500;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class FoodieWebSocketHandler extends TextWebSocketHandler {

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
                    throw new Exception500("챗봇과의 연결을 종료할 수 없습니다.");
                }
            }
        } catch (InterruptedException e) {
            throw new Exception500("챗봇 메시지 처리 중 오류가 발생했습니다");
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
            throw new Exception500("챗봇 응답 오류 입니다.");
        }
        return false;
    }
}