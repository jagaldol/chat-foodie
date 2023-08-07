package net.chatfoodie.server.chatroom.dto;

import jakarta.validation.constraints.Size;

public class ChatroomRequest {
    public record ChangeTitleDto(
            @Size(max = 50, message = "최대 50자까지 입니다.")
            String title
    ) { }
}
