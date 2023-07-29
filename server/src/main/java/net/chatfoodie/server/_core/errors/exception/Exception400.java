package net.chatfoodie.server._core.errors.exception;

import net.chatfoodie.server._core.utils.ApiUtils;
import org.springframework.http.HttpStatus;

public class Exception400 extends RuntimeException {

    public Exception400(String message) {
        super(message);
    }

    public HttpStatus status() {
        return HttpStatus.BAD_REQUEST;
    }

    public ApiUtils.Response<?> body() {
        return ApiUtils.error(getMessage(), HttpStatus.BAD_REQUEST);
    }

}
