package net.chatfoodie.server._core.errors.exception;

public class EmailAlreadyExistException extends CustomException {
    public EmailAlreadyExistException(String message) {
        super(message);
    }

    @Override
    public Integer status() {
        return 462;
    }
}
