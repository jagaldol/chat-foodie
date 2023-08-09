package net.chatfoodie.server.chatroom.message.dto;

import net.chatfoodie.server.chatroom.message.Message;
import java.util.List;


public class MessageResponse {
    public record contentList(List<MessageDto> messages) {
        // messages 리스트에서 content와 isFromChatbot가져오는 메소드
        public static contentList of(List<Message> messageList) {
            return new contentList(messageList.stream()
                    .map(message -> new MessageDto(message.getContent(), message.isFromChatbot()))
                    .toList());
        }

        public record MessageDto(String content, Boolean isFromChatbot) {

        }
    }
}
