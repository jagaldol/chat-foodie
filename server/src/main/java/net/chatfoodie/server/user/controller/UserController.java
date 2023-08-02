package net.chatfoodie.server.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.errors.exception.Exception400;
import net.chatfoodie.server._core.security.JwtProvider;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server._core.utils.Utils;
import net.chatfoodie.server.user.dto.UserRequest;
import net.chatfoodie.server.user.dto.UserResponse;
import net.chatfoodie.server.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class UserController {

    final private UserService userService;

    @GetMapping("users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        UserResponse.GetUserDto getUserDto = userService.getUser(id);
        ApiUtils.Response<?> response = ApiUtils.success(getUserDto);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody @Valid UserRequest.JoinDto requestDto, Errors errors) {
        if (requestDto.birth() != null) {
            List<Integer> birthSplit = Arrays.stream(requestDto.birth().split("-"))
                    .map(Integer::parseInt)
                    .toList();
            if (!Utils.validateDayOfDateString(birthSplit.get(0), birthSplit.get(1), birthSplit.get(2)))
                throw new Exception400("올바른 날짜가 아닙니다.(형식: 0000-00-00)");
        }

        userService.join(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserRequest.LoginDto requestDto, Errors errors) {
        String jwt = userService.issueJwtByLogin(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().header(JwtProvider.HEADER, jwt).body(response);
    }
}
