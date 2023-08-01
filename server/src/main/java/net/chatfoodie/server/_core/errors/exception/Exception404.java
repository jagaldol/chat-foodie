package net.chatfoodie.server._core.errors.exception;

import net.chatfoodie.server._core.utils.ApiUtils;
import org.springframework.http.HttpStatus;

public class Exception404 extends RuntimeException {

    public Exception404(String message) {
        super(message);
    }

    public HttpStatus status() {
        return HttpStatus.NOT_FOUND;
    }

    public ApiUtils.Response<?> body() {
        return ApiUtils.error(getMessage(), HttpStatus.NOT_FOUND);
    }

}
