package net.chatfoodie.server._core.errors.exception;

import net.chatfoodie.server._core.utils.ApiUtils;

public class LoginIdAlreadyExistException extends CustomException{
    public LoginIdAlreadyExistException(String message) {
        super(message);
    }

    @Override
    public Integer status() {
        return 461;
    }
}
