package net.chatfoodie.server.chatroom.dto;

import net.chatfoodie.server.chatroom.Chatroom;

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
}
