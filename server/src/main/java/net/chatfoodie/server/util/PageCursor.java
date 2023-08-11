package net.chatfoodie.server.util;

import java.util.List;

public record PageCursor<T> (
        CursorRequest nextCursorRequest,
        List<T> body
) {
}