package net.chatfoodie.server.domain.user.service;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server.domain.user.dto.UserDto;
import net.chatfoodie.server.domain.user.entity.User;
import net.chatfoodie.server.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserReadService {
    final private UserRepository userRepository;

    public UserDto getUserById(Long id) {
        var user = userRepository.findById(id).orElseThrow();
        return toDto(user);
    }

    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getLogin_id(),
                user.getName(),
                user.getGender(),
                user.getBirth(),
                user.getEmail()
        );
    }


}
