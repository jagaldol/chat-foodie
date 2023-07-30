package net.chatfoodie.server.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.security.JwtProvider;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server.user.dto.UserRequest;
import net.chatfoodie.server.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class UserController {

    final private UserService userService;

    @GetMapping("users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {

        return ResponseEntity.ok().body(id + "의 정보");
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody @Valid UserRequest.JoinDto requestDto, Errors errors) {
        userService.join(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success(null);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest.LoginDto requestDto) {
        String jwt = userService.issueJwtByLogin(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success("성공");
        return ResponseEntity.ok().header(JwtProvider.HEADER, jwt).body(response);
    }
}
