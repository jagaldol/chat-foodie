package net.chatfoodie.server._core.utils.cursor;

public record CursorRequest(
        Long key,
        Integer size
) {
    public static final Long NONE_KEY = -1L;

    public Integer getSize() {
        return size == null ? 50 : size;
    }

    public Boolean hasKey() {
        return key != null;
    }
    public CursorRequest next(Long key) {
        return new CursorRequest(key, size);
    }
}
