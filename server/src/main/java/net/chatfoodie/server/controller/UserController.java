package net.chatfoodie.server.controller;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.security.JwtProvider;
import net.chatfoodie.server.domain.user.dto.UserDto;
import net.chatfoodie.server.domain.user.dto.UserRequest;
import net.chatfoodie.server.domain.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class UserController {

    final private UserService userService;

    @GetMapping("users/{id}")
    public UserDto getUser(@PathVariable Long id) {

        return userService.getUserById(id);
    }

    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody UserRequest.JoinDto requestDto) {
        userService.join(requestDto);
        return ResponseEntity.ok().body("success");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserRequest.LoginDto requestDto) {
        String jwt = userService.issueJwtByLogin(requestDto);
        return ResponseEntity.ok().header(JwtProvider.HEADER, jwt).body("성공");
    }
}
