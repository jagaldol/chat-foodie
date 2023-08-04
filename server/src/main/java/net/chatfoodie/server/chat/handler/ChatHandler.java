package net.chatfoodie.server.chat.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server.chat.service.ChatService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RequiredArgsConstructor
@Component
public class ChatHandler extends TextWebSocketHandler {

    private final ChatService chatService;

    private final Map<WebSocketSession, String> userChatRooms = new ConcurrentHashMap<>();


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 클라이언트가 채팅방에 입장 요청 시, 사용자와 채팅방을 매칭하여 저장
        String userId = session.getId(); // 사용자 ID를 적절히 설정 (세션 ID를 사용할 수도 있음)
        String chatRoomId = "chatRoom_" + userId; // 개별적인 채팅방 ID를 설정 (예: chatRoom_userId)
        userChatRooms.put(session, chatRoomId);
        log.info(session + "클라이언트 접속");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // TODO: pulbic-chat의 경우 하루 요청가능 횟수 제한 필요

        String payload = message.getPayload();
        log.info("받은 메시지 : " + payload);

        String chatRoomId = userChatRooms.get(session);
        var users = userChatRooms.keySet().stream()
                .filter(s -> userChatRooms.get(s).equals(chatRoomId))
                .toList();

        chatService.requestToFoodie(payload, users);

        // TODO: 응답 이후 일정 시간 후 자동 Connection Close??
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info(session + " 클라이언트 접속 해제");
        userChatRooms.remove(session);
    }
}
