package net.chatfoodie.server.chat;

public record ChatSessionInfo(
        String chatSessionId,
        Long expirationTime
) {
    private static final Long connectionTimeout = 10 * 60 * 1000L; // 10m

    public ChatSessionInfo(String chatRoomId) {
        this(chatRoomId, System.currentTimeMillis() + connectionTimeout);
    }

}
