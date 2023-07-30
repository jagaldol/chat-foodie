package net.chatfoodie.server._core.errors;

import net.chatfoodie.server._core.errors.exception.*;
import net.chatfoodie.server._core.utils.ApiUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception400.class)
    public ResponseEntity<?> badRequest(Exception400 e) {
        return ResponseEntity.status(e.status()).body(e.body());
    }

    @ExceptionHandler(Exception401.class)
    public ResponseEntity<?> unAuthorized(Exception401 e) {
        return ResponseEntity.status(e.status()).body(e.body());
    }

    @ExceptionHandler(Exception403.class)
    public ResponseEntity<?> forbidden(Exception403 e) {
        return ResponseEntity.status(e.status()).body(e.body());
    }

    @ExceptionHandler(Exception404.class)
    public ResponseEntity<?> notFound(Exception404 e) {
        return ResponseEntity.status(e.status()).body(e.body());
    }

    @ExceptionHandler(Exception500.class)
    public ResponseEntity<?> internalServerError(Exception500 e) {
        return ResponseEntity.status(e.status()).body(e.body());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> unknownServerError(Exception e) {
        var status = HttpStatus.INTERNAL_SERVER_ERROR;
        var response = ApiUtils.error(e.getMessage(), status);
        return ResponseEntity.status(status).body(response);
    }

}
