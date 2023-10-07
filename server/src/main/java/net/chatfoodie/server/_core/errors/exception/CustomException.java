package net.chatfoodie.server._core.errors.exception;

import net.chatfoodie.server._core.utils.ApiUtils;
import org.springframework.http.HttpStatus;

public abstract class CustomException extends RuntimeException{
    public CustomException(String message) {
        super(message);
    }

    public abstract Integer status();

    public ApiUtils.Response<?> body() {
        return ApiUtils.error(getMessage(), status());
    }

}
