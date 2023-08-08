package net.chatfoodie.server.chat.dto;

import java.util.List;

public class ChatFoodieRequest {
    public record MessageDto(
            String user_input,
            HistoryDto history,
            Boolean regenerate,
            Integer max_new_token,
            String character,
            String instruction_template,
            String your_name,
            Float temperature,
            Float top_p,
            Float repetition_penalty,
            Float top_k,
            Boolean early_stopping
    ) {

        public MessageDto(ChatUserRequest.PublicMessageDto userPublicMessageDto) {
            this(
                    userPublicMessageDto.input(),
                    new HistoryDto(userPublicMessageDto.history()),
                    userPublicMessageDto.regenerate() != null && userPublicMessageDto.regenerate(),
                    250,
                    "Example",
                    "Alpaca",
                    "회원",
                    0.7f,
                    0.9f,
                    1.15f,
                    20.0f,
                    false
            );
        }

        record HistoryDto(
                List<List<String>> internal,
                List<List<String>> visible
        ) {
            public HistoryDto(List<List<String>> userRequestHistory) {
                this(
                        userRequestHistory,
                        userRequestHistory
                );
            }
        }
    }
}
