package net.chatfoodie.server._core.errors;

import net.chatfoodie.server._core.errors.exception.Exception400;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception400.class)
    public ResponseEntity<?> badRequest(Exception400 e) {
        return ResponseEntity.status(e.status()).body(e.body());
    }

}
