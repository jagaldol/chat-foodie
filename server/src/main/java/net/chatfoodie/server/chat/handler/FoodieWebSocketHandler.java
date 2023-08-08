package net.chatfoodie.server.chat.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server.chat.dto.ChatFoodieResponse;
import net.chatfoodie.server.chat.service.FoodieWebSocketService;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Slf4j
public class FoodieWebSocketHandler extends TextWebSocketHandler {

    private final BlockingQueue<ChatFoodieResponse.MessageDto> messageQueue = new LinkedBlockingQueue<>();

    private final ObjectMapper om = new ObjectMapper();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            String receivedMessage = message.getPayload();

            var receivedMessageDto = om.readValue(receivedMessage, ChatFoodieResponse.MessageDto.class);

            messageQueue.put(receivedMessageDto); // 받은 메시지를 큐에 추가


            if (FoodieWebSocketService.isStreamEndEvent(receivedMessageDto)) {
                try {
                    session.close();
                } catch (Exception e) {
                    log.error("챗봇과의 연결을 종료할 수 없습니다.");
                }
            }
        } catch (InterruptedException e) {
            log.error("챗봇 메시지 처리 중 오류가 발생했습니다.");
        } catch (JsonProcessingException e) {
            log.error("챗봇으로부터 잘못된 형식의 응답이 들어왔습니다.");
        }
    }

    public ChatFoodieResponse.MessageDto receiveMessage() throws InterruptedException {
        return messageQueue.take(); // 큐에서 메시지를 가져옴 (메시지가 없으면 대기)
    }
}