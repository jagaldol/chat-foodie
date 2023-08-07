package net.chatfoodie.server.chat.dto;

import java.util.List;

public class ChatFoodieResponse {

    public record MessageDto(
            String event,
            int message_num,
            HistoryDto history
    ) {
        record HistoryDto(
            List<List<String>> internal,
            List<List<String>> visible
        ) { }
    }
}
