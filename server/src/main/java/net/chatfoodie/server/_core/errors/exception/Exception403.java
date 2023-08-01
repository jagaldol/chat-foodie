package net.chatfoodie.server._core.errors.exception;

import net.chatfoodie.server._core.utils.ApiUtils;
import org.springframework.http.HttpStatus;

public class Exception403 extends RuntimeException {

    public Exception403(String message) {
        super(message);
    }

    public HttpStatus status() {
        return HttpStatus.FORBIDDEN;
    }

    public ApiUtils.Response<?> body() {
        return ApiUtils.error(getMessage(), HttpStatus.FORBIDDEN);
    }

}
