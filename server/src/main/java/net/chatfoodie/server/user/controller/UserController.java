package net.chatfoodie.server.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.errors.exception.Exception400;
import net.chatfoodie.server._core.errors.exception.Exception403;
import net.chatfoodie.server._core.security.CustomUserDetails;
import net.chatfoodie.server._core.security.JwtProvider;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server._core.utils.Utils;
import net.chatfoodie.server.user.dto.UserRequest;
import net.chatfoodie.server.user.dto.UserResponse;
import net.chatfoodie.server.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class UserController {

    final private UserService userService;

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (!Objects.equals(userDetails.getId(), id)) {
            throw new Exception403("권한이 없습니다.");
        }
        UserResponse.GetUserDto getUserDto = userService.getUser(id);
        ApiUtils.Response<?> response = ApiUtils.success(getUserDto);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody @Valid UserRequest.JoinDto requestDto, Errors errors) {
        validateBirthForm(requestDto.birth());
        String jwt = userService.join(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().header(JwtProvider.HEADER, jwt).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserRequest.LoginDto requestDto, Errors errors) {
        String jwt = userService.issueJwtByLogin(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().header(JwtProvider.HEADER, jwt).body(response);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @AuthenticationPrincipal CustomUserDetails userDetails,
                                        @RequestBody @Valid UserRequest.UpdateDto requestDto,
                                        Errors errors) {
        if (!Objects.equals(userDetails.getId(), id)) {
            throw new Exception403("권한이 없습니다.");
        }

        validateBirthForm(requestDto.birth());

        String jwt = userService.updateUser(id, requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().header(JwtProvider.HEADER, jwt).body(response);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id,
                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (!Objects.equals(userDetails.getId(), id)) {
            throw new Exception403("권한이 없습니다.");
        }

        userService.deleteUser(id);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/help/loginId")
    public ResponseEntity<?> findUserId(@RequestBody @Valid UserRequest.FindUserIdDto requestDto) {
        UserResponse.FindUserIdDto responseDto = userService.findUserId(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success(responseDto);
        return ResponseEntity.ok().body(response);
    }
    @PostMapping("/validate/loginId")
    public ResponseEntity<?> validateLoginId(@RequestBody @Valid UserRequest.ValidateLoginIdDto requestDto,
                                             Errors errors) {
        userService.validateLoginId(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate/email")
    public ResponseEntity<?> validateEmail(@RequestBody @Valid UserRequest.ValidateEmailDto requestDto,
                                             Errors errors) {
        userService.validateEmail(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok(response);
    }

    private static void validateBirthForm(String birth) {
        if (birth != null) {
            List<Integer> birthSplit = Arrays.stream(birth.split("-"))
                    .map(Integer::parseInt)
                    .toList();
            if (!Utils.validateDayOfDateString(birthSplit.get(0), birthSplit.get(1), birthSplit.get(2)))
                throw new Exception400("올바른 날짜가 아닙니다.(형식: 0000-00-00)");
        }
    }
}
