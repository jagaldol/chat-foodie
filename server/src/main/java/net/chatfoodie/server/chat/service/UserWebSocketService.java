package net.chatfoodie.server.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception400;
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

    public void requestToFoodie(ChatUserRequest.MessageDto userMessageDto, List<WebSocketSession> users) {
        // 메시지를 보내고 응답을 받습니다.
        var foodieMessageDto = new ChatFoodieRequest.MessageDto(userMessageDto);

        String messageToSend;
        try {
            messageToSend = om.writeValueAsString(foodieMessageDto);
        } catch (JsonProcessingException e) {
            log.info("챗봇 전달 메시지 변환 중 오류가 발생했습니다.");
            return;
        }

        FoodieWebSocketService foodieWebSocketService = new FoodieWebSocketService(serverUri);
        foodieWebSocketService.sendMessage(messageToSend);
        foodieWebSocketService.listenForMessages(users);
    }
}
