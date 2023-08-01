package net.chatfoodie.server.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception400;
import net.chatfoodie.server._core.errors.exception.Exception500;
import net.chatfoodie.server._core.security.JwtProvider;
import net.chatfoodie.server.user.dto.UserRequest;
import net.chatfoodie.server.user.User;
import net.chatfoodie.server.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class UserService {

    final private UserRepository userRepository;

    final private PasswordEncoder passwordEncoder;


    @Transactional
    public void join(UserRequest.JoinDto requestDto) {
        var loginId = requestDto.loginId();
        var email = requestDto.email();


        if (userRepository.findByLoginId(requestDto.loginId()).isPresent()) {
            throw new Exception400("이미 존재하는 아이디입니다");
        }

        if (userRepository.findByEmail(requestDto.email()).isPresent()) {
            throw new Exception400("이미 존재하는 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(requestDto.password());

        var user = requestDto.createUser(encodedPassword);

        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new Exception500("회원가입 중에 오류가 발생했습니다. 다시 시도해주세요.");
        }
    }

    public String issueJwtByLogin(UserRequest.LoginDto requestDto) {
        User user = userRepository.findByLoginId(requestDto.loginId()).orElseThrow();

        if (!passwordEncoder.matches(requestDto.password(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 틀렸습니다.");
        }
        return JwtProvider.create(user);
    }

}
