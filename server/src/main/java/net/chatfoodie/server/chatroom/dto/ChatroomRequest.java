package net.chatfoodie.server.chatroom.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ChatroomRequest {
    public record ChangeTitleDto(
            @NotNull(message = "제목을 반드시 입력해야 합니다.")
            @Size(max = 50, message = "최대 50자까지 입니다.")
            String title
    ) { }
}
