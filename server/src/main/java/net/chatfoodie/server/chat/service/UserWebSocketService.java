package net.chatfoodie.server.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception403;
import net.chatfoodie.server._core.errors.exception.Exception404;
import net.chatfoodie.server._core.security.CustomUserDetails;
import net.chatfoodie.server._core.utils.MyFunction;
import net.chatfoodie.server.chat.dto.ChatFoodieRequest;
import net.chatfoodie.server.chat.dto.ChatUserRequest;
import net.chatfoodie.server.chatroom.Chatroom;
import net.chatfoodie.server.chatroom.message.Message;
import net.chatfoodie.server.chatroom.message.repository.MessageRepository;
import net.chatfoodie.server.chatroom.repository.ChatroomRepository;
import net.chatfoodie.server.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.WebSocketSession;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class UserWebSocketService {

    @Value("${chatbot.url}")
    private String serverUri;

    private  final ObjectMapper om;

    private final UserRepository userRepository;

    private final MessageRepository messageRepository;

    private final ChatroomRepository chatroomRepository;

    public void requestToFoodie(ChatFoodieRequest.MessageDto foodieMessageDto, WebSocketSession user, Long chatroomId) {
        // 메시지를 보내고 응답을 받습니다.
        var chatroom = chatroomRepository.findById(chatroomId).orElseThrow();
        Long userId = getUserId(user); // throw 될거 생각
        var userMessage = Message.builder()
                .chatroom(chatroom)
                .isFromChatbot(false)
                .content(foodieMessageDto.user_input())
                .build();

        messageRepository.save(userMessage);

        sendMessageToFoodie(foodieMessageDto, user, (message) -> {
            Message chatbotMessage = Message.builder()
                    .chatroom(chatroom)
                    .isFromChatbot(true)
                    .content(message)
                    .build();
            messageRepository.save(chatbotMessage);
            log.debug("함수를 전달해서 실행시킴!!!!!!!!!!\n" + message);
        });
    }

    public void requestToFoodiePublic(ChatFoodieRequest.MessageDto foodieMessageDto, WebSocketSession user) {
        // 메시지를 보내고 응답을 받습니다.
        // TODO: ip 기반으로 테이블 조회해서 10회 보냈으면 block 필요
        sendMessageToFoodie(foodieMessageDto, user, (message) -> {
            // TODO: ip랑 input, history, response를 저장 필요
            log.debug("public api 마지막 전달 완료!!\n" + message);
        });
    }

    private void sendMessageToFoodie(ChatFoodieRequest.MessageDto foodieMessageDto, WebSocketSession user, MyFunction function) {
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
        foodieWebSocketService.listenForMessages(user, function);
    }

    public Long getUserId(WebSocketSession session) {
        Authentication authentication = (Authentication) session.getPrincipal();

        if (authentication == null) {
            throw new RuntimeException();
        }
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        return customUserDetails.getId();
    }

    @Transactional
    public ChatFoodieRequest.MessageDto makeFoodieRequestDto(ChatUserRequest.MessageDto userMessageDto, Long userId) {

        Chatroom chatroom = chatroomRepository.findByIdJoinUser(userMessageDto.chatroomId())
                .orElseThrow(() -> new Exception404("존재하지 않는 채팅방입니다."));

        if (!Objects.equals(userId, chatroom.getUser().getId()))
            throw new Exception403("권한이 없는 채팅방입니다.");

        var messages = messageRepository.findTop38ByChatroomIdOrderByIdDesc(userMessageDto.chatroomId());

        // TODO: 맨 앞에 선호도 채팅을 추가하기!!!
        var history = makeHistoryFromMessages(messages);
        return new ChatFoodieRequest.MessageDto(userMessageDto, history, chatroom.getUser().getName());
    }

    private List<List<String>> makeHistoryFromMessages(List<Message> messages) {
        List<String> reversedMessages = new ArrayList<>();

        for (Message message : messages) {

            var isChatbotTurn = reversedMessages.size() % 2 == 0;

            if (isChatbotTurn && !message.isFromChatbot()) {
               reversedMessages.add("");
            }
            if (!isChatbotTurn && message.isFromChatbot()) {
                reversedMessages.add("");
            }

            reversedMessages.add(message.getContent());

            if (reversedMessages.size() >= 38)
                break;
        }
        if (reversedMessages.size() % 2 == 1)
            reversedMessages.remove(reversedMessages.size() - 1);

        List<List<String>> history = new ArrayList<>();

        for(int i = reversedMessages.size() - 1; i >= 0; i -= 2) {
            history.add(List.of(reversedMessages.get(i), reversedMessages.get(i - 1)));
        }

        return history;
    }
}
