package net.chatfoodie.server.chatroom.dto;

import net.chatfoodie.server.chatroom.Chatroom;
import net.chatfoodie.server.user.User;

public class ChatroomRequest {

    public record CreateDto(
            User user,
            String title
    ) {
        public Chatroom createChatroom() {
            return Chatroom.builder()
                    .title(title)
                    .user(user)
                    .build();
        }
    }
}
