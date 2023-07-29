package net.chatfoodie.server.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.security.JwtProvider;
import net.chatfoodie.server.user.dto.UserDto;
import net.chatfoodie.server.user.dto.UserRequest;
import net.chatfoodie.server.user.User;
import net.chatfoodie.server.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    final private UserRepository userRepository;

    final private PasswordEncoder passwordEncoder;

    public UserDto getUserById(Long id) {
        var user = userRepository.findById(id).orElseThrow();
        return toDto(user);
    }

    public void join(UserRequest.JoinDto requestDto) {
        // TODO: 중복 체크 필요
        log.debug(requestDto.toString());
        String encodedPassword = passwordEncoder.encode(requestDto.password());
        userRepository.save(requestDto.createUser(encodedPassword));
    }

    public String issueJwtByLogin(UserRequest.LoginDto requestDto) {
        User user = userRepository.findByLoginId(requestDto.loginId()).orElseThrow();

        if (!passwordEncoder.matches(requestDto.password(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 틀렸습니다.");
        }
        return JwtProvider.create(user);
    }

    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getLoginId(),
                user.getName(),
                user.getGender(),
                user.getBirth(),
                user.getEmail()
        );
    }


}
