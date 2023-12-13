package net.chatfoodie.server.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.*;
import net.chatfoodie.server._core.security.JwtProvider;
import net.chatfoodie.server._core.utils.Utils;
import net.chatfoodie.server.chatroom.Chatroom;
import net.chatfoodie.server.chatroom.message.repository.MessageRepository;
import net.chatfoodie.server.chatroom.repository.ChatroomRepository;
import net.chatfoodie.server.favor.Favor;
import net.chatfoodie.server.favor.repository.FavorRepository;
import net.chatfoodie.server.user.Role;
import net.chatfoodie.server.user.User;
import net.chatfoodie.server.user.dto.UserRequest;
import net.chatfoodie.server.user.dto.UserResponse;
import net.chatfoodie.server.user.repository.UserRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    private final FavorRepository favorRepository;

    private final ChatroomRepository chatroomRepository;

    private final MessageRepository messageRepository;

    private final PasswordEncoder passwordEncoder;

    private final JavaMailSender javaMailSender;

    private final RedisTemplate<String, String> redisTemplate;

    @Transactional
    public UserResponse.TokensDto join(UserRequest.JoinDto requestDto) {

        if (!Objects.equals(requestDto.password(), requestDto.passwordCheck())) {
            throw new Exception400("비밀번호 확인이 일치하지 않습니다.");
        }

        if (userRepository.findByLoginId(requestDto.loginId()).isPresent()) {
            throw new LoginIdAlreadyExistException("이미 존재하는 아이디입니다");
        }

        if (userRepository.findByEmail(requestDto.email()).isPresent()) {
            throw new EmailAlreadyExistException("이미 존재하는 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(requestDto.password());

        var user = requestDto.createUser(encodedPassword);

        try {
            var savedUser = userRepository.save(user);
            return  issueTokens(savedUser);
        } catch (Exception e) {
            throw new Exception500("회원가입 중에 오류가 발생했습니다. 다시 시도해주세요.");
        }
    }

    public UserResponse.TokensDto issueJwtByLogin(UserRequest.LoginDto requestDto) {
        User user = userRepository.findByLoginId(requestDto.loginId()).orElseThrow(() ->
                new Exception400("아이디 혹은 비밀번호가 틀렸습니다."));

        if (!passwordEncoder.matches(requestDto.password(), user.getPassword())) {
            throw new Exception400("아이디 혹은 비밀번호가 틀렸습니다.");
        }
        return issueTokens(user);
    }

    private UserResponse.TokensDto issueTokens(User user) {
        var access = JwtProvider.createAccess(user);
        var refresh = JwtProvider.createRefresh(user);

        redisTemplate.opsForValue().set(
                user.getId().toString(),
                refresh,
                JwtProvider.REFRESH_EXP_SEC,
                TimeUnit.SECONDS
        );

        return new UserResponse.TokensDto(access, refresh);
    }

    public UserResponse.GetUserDto getUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new Exception404("존재하지 않는 사용자입니다."));

        List<Favor> favors = favorRepository.findByUserId(id);

        return new UserResponse.GetUserDto(user, favors);
    }

    @Transactional
    public String updateUser(Long id, UserRequest.UpdateDto requestDto) {
        var user = userRepository.findById(id).orElseThrow(() -> new Exception500("개인 정보 변경 중 오류가 발생했습니다. 다시 시도해주세요."));

        // loginId 존재 시
        if (requestDto.loginId() != null) {
            if (!Objects.equals(user.getLoginId(), requestDto.loginId())) {
                if (userRepository.findByLoginId(requestDto.loginId()).isPresent()) {
                    throw new Exception400("이미 존재하는 아이디입니다");
                }
                user.updateLoginId(requestDto.loginId());
            }
        }
        // password 존재 시
        if (requestDto.password() != null) {
            if (!Objects.equals(requestDto.password(), requestDto.passwordCheck())) {
                throw new Exception400("비밀번호 확인이 일치하지 않습니다.");
            }
            String encodedPassword = passwordEncoder.encode(requestDto.password());
            user.updatePassword(encodedPassword);
        }

        if (requestDto.name() != null) {
            user.updateName(requestDto.name());
        }

        if (requestDto.gender() != null) {
            user.updateGender(requestDto.gender());
        }

        if (requestDto.birth() != null) {
            user.updateBirth(Utils.convertStringToDate(requestDto.birth()));
        }

        if (requestDto.email() != null) {
            user.updateEmail(requestDto.email());
            user.updateRole(Role.ROLE_PENDING);
        }
        return JwtProvider.createAccess(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new Exception404("존재하지 않는 사용자입니다."));
        List<Chatroom> chatrooms = chatroomRepository.findAllByUserId(id);

        favorRepository.deleteAllByUserId(id);
        for (Chatroom chatroom : chatrooms) {
            messageRepository.deleteAllByChatroomId(chatroom.getId());
            chatroomRepository.deleteById(chatroom.getId());
        }
        userRepository.delete(user);
    }

    public void validateLoginId(UserRequest.ValidateLoginIdDto requestDto) {
        if (userRepository.findByLoginId(requestDto.loginId()).isPresent()) {
            throw new LoginIdAlreadyExistException("이미 존재하는 아이디입니다");
        }
    }

    public void validateEmail(UserRequest.ValidateEmailDto requestDto) {
        if (userRepository.findByEmail(requestDto.email()).isPresent()) {
            throw new EmailAlreadyExistException("이미 존재하는 이메일입니다.");
        }
    }

    public UserResponse.FindUserIdDto findUserId(UserRequest.FindUserIdDto requestDto) {
        User user = userRepository.findByEmail(requestDto.email()).orElseThrow(() -> new Exception404("존재하지 않는 사용자입니다."));

        return new UserResponse.FindUserIdDto(user.getLoginId());
    }

    @Transactional
    public void resetPassword(UserRequest.ResetPasswordDto requestDto) {
        User user = userRepository.findByLoginId(requestDto.loginId()).orElseThrow(() -> new Exception404("존재하지 않는 사용자입니다."));

        if (!Objects.equals(user.getEmail(), requestDto.email())) {
            throw new Exception400("아이디와 이메일이 일치하지 않습니다.");
        }

        String randomPassword = Utils.generateRandomPassword();
        String encodedPassword = passwordEncoder.encode(randomPassword);
        log.info("임시 비밀번호: {}", randomPassword);
        user.updatePassword(encodedPassword);

        sendEmail(user.getEmail(), randomPassword);
    }

    private void sendEmail(String email, String password) {
        String subject = "chatfoodie 임시 비밀번호입니다.";
        String text = "임시 비밀번호는 " + password + "입니다. </br>";

        Utils.sendEmail(javaMailSender, email, subject, text);
    }

    public UserResponse.TokensDto reIssueTokens(String refreshToken) {
        var decodedRefreshToken = JwtProvider.verify(refreshToken);

        if (!Objects.equals(redisTemplate.opsForValue().get(decodedRefreshToken.getClaim("id").asLong().toString()), refreshToken))
            throw new Exception401("유효하지 않은 refresh 토큰입니다.");

        var user = userRepository.findById(decodedRefreshToken.getClaim("id").asLong()).orElseThrow(() ->
                new Exception500("재발급 과정에서 오류가 발생했습니다."));

        log.debug(user.getId().toString());

        return issueTokens(user);
    }

    public void logout(Long id) {
        redisTemplate.delete(id.toString());
    }
}
