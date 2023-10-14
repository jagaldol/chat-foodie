package net.chatfoodie.server.chat.dto;

import java.util.Collections;
import java.util.List;

public class ChatFoodieRequest {

    private static final Integer MAX_NEW_TOKEN = 250;
    private static final String CHARACTER = "Example";
    private static final String INSTRUCTION_TEMPLATE = "Alpaca";
    private static final Float TEMPERATURE = 0.7f;
    private static final Float TOP_P = 0.9f;
    private static final Float REPETITION_PENALTY = 1.15f;
    private static final Float TOP_K = 20.0f;
    private static final Boolean EARLY_STOPPING = false;
    private static final List<String> STOPPING_STRINGS = Collections.unmodifiableList(
            List.of(
                    "\n###",
                    "\n답변:",
                    "\n고객",
                    "\n회원",
                    ":"
            )
    );

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
            Boolean early_stopping,
            List<String> stopping_strings
    ) {

        public MessageDto(ChatUserRequest.PublicMessageDto userPublicMessageDto) {
            this(
                    userPublicMessageDto.input(),
                    new HistoryDto(userPublicMessageDto.history()),
                    userPublicMessageDto.regenerate() != null && userPublicMessageDto.regenerate(),
                    MAX_NEW_TOKEN,
                    CHARACTER,
                    INSTRUCTION_TEMPLATE,
                    "회원",
                    TEMPERATURE,
                    TOP_P,
                    REPETITION_PENALTY,
                    TOP_K,
                    EARLY_STOPPING,
                    STOPPING_STRINGS
            );
        }

        public MessageDto(ChatUserRequest.MessageDto userMessageDto, List<List<String>> history, String userName) {
            this(
                    userMessageDto.input(),
                    new HistoryDto(history),
                    userMessageDto.regenerate() != null && userMessageDto.regenerate(),
                    MAX_NEW_TOKEN,
                    CHARACTER,
                    INSTRUCTION_TEMPLATE,
                    userName,
                    TEMPERATURE,
                    TOP_P,
                    REPETITION_PENALTY,
                    TOP_K,
                    EARLY_STOPPING,
                    STOPPING_STRINGS
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
