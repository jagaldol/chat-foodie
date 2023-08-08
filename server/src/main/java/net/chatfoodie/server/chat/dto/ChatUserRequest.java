package net.chatfoodie.server.chat.dto;

import java.util.List;

public class ChatUserRequest {

    public record MessageDto(
            String input,
            List<List<String>> history,
            Boolean regenerate
    ) {
        public boolean validate() {
            var validInput = input.length() <= 500;
            var validHistory = history.size() <= 20 && history.stream().allMatch(messagePair -> messagePair.size() == 2);
            var validRegenerate = regenerate || !input.isEmpty();
            return validInput && validHistory && validRegenerate;
        }
    }
}
