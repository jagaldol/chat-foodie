package net.chatfoodie.server.user.controller;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.security.JwtProvider;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server.user.dto.UserDto;
import net.chatfoodie.server.user.dto.UserRequest;
import net.chatfoodie.server.user.service.UserService;
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
    public ResponseEntity<?> join(@RequestBody UserRequest.JoinDto requestDto) {
        userService.join(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success("성공");
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest.LoginDto requestDto) {
        String jwt = userService.issueJwtByLogin(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success("성공");
        return ResponseEntity.ok().header(JwtProvider.HEADER, jwt).body(response);
    }
}
