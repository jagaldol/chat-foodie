package net.chatfoodie.server.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server.chat.dto.ChatFoodieRequest;
import net.chatfoodie.server.chat.dto.ChatUserRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserWebSocketService {

    @Value("${chatbot.url}")
    private String serverUri;

    private  final ObjectMapper om;

    public void requestToFoodie(ChatUserRequest.PublicMessageDto userPublicMessageDto, List<WebSocketSession> users) {
        // 메시지를 보내고 응답을 받습니다.
        var foodieMessageDto = new ChatFoodieRequest.MessageDto(userPublicMessageDto);

        String messageToSend;
        try {
            messageToSend = om.writeValueAsString(foodieMessageDto);
        } catch (JsonProcessingException e) {
            log.error("챗봇 전달 메시지 변환 중 오류가 발생했습니다.");
            return;
        }

        FoodieWebSocketService foodieWebSocketService = new FoodieWebSocketService(serverUri);
        try {
            foodieWebSocketService.sendMessage(messageToSend);
        } catch (Exception e) {
            log.error("챗봇으로 메시지 전송 중 오류가 발생했습니다.");
            return;
        }
        foodieWebSocketService.listenForMessages(users);
    }
}
