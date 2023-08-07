package net.chatfoodie.server.chat.dto;

import java.util.Objects;

public class ChatUserResponse {

    public record MessageDto(
            String event,
            String response
    ) {
        public MessageDto(ChatFoodieResponse.MessageDto foodieMessageDto) {
            this(
                    foodieMessageDto.event(),
                    Objects.equals(foodieMessageDto.event(), "stream_end") ? "":
                    foodieMessageDto.history().internal()
                            .get(foodieMessageDto.history().internal().size() - 1)
                            .get(1)
            );
        }
    }
}
