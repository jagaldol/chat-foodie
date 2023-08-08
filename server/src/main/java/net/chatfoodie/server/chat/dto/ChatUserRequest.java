package net.chatfoodie.server.chat.dto;

import java.util.List;

public class ChatUserRequest {

    public record PublicMessageDto(
            String input,
            List<List<String>> history,
            Boolean regenerate
    ) {
        public boolean notValidate() {
            var validInput = input.length() <= 500;
            var validHistory = history.size() <= 20 && history.stream().allMatch(messagePair -> messagePair.size() == 2);
            var validRegenerate = regenerate || !input.isEmpty();
            return !validInput || !validHistory || !validRegenerate;
        }
    }

    public record MessageDto(
            String input,
            Long chatroomId,
            Boolean regenerate
    ) {
        public boolean notValidate() {
            var validInput = input.length() <= 500;
            var validRegenerate = regenerate || !input.isEmpty();
            return !validInput || !validRegenerate;
        }
    }
}
