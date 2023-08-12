package net.chatfoodie.server.chatroom.dto;

import net.chatfoodie.server.chatroom.Chatroom;
import net.chatfoodie.server.chatroom.message.Message;

import java.util.List;

public class ChatroomResponse {
    public record GetChatroomDto(
            List<ChatroomDto> chatrooms
    ) {
        public static GetChatroomDto of(List<Chatroom> chatrooms) {
            return new GetChatroomDto(chatrooms.stream()
                            .map(ChatroomDto::new)
                            .toList());
        }

        public record ChatroomDto(
                Long id,
                String title
        ) {
            public ChatroomDto(Chatroom chatroom) {
                this(chatroom.getId(), chatroom.getTitle());
            }
        }
    }

    public record getMessagesDto(
            List<MessageDto> messages
    ) {
        // messages 리스트에서 content와 isFromChatbot가져오는 메소드
        public static getMessagesDto of(List<Message> messageList) {
            return new getMessagesDto(messageList.stream()
                    .map(message ->
                            new MessageDto(
                                    message.getId(),
                                    message.getContent(),
                                    message.isFromChatbot()
                            )
                    )
                    .toList());
        }

        public record MessageDto(
                Long id,
                String content,
                Boolean isFromChatbot
        ) {

        }
    }
}
