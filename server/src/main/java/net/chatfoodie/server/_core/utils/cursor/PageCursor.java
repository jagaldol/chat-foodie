package net.chatfoodie.server._core.utils.cursor;

public record PageCursor<T> (
        CursorRequest nextCursorRequest,
        T body
) {
}