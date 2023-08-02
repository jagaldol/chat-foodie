package net.chatfoodie.server.user.dto;

import net.chatfoodie.server.favor.Favor;
import net.chatfoodie.server.user.User;

import java.util.List;

public class UserResponse {
    public record getUserDto(
        Long id,
        String loginId,
        String name,
        Boolean gender,
        String birth,
        String email,
        List<FavorDto> favors
    ){
        public getUserDto(User user, List<Favor> favors) {
            this(
                    user.getId(),
                    user.getLoginId(),
                    user.getName(),
                    user.getGender(),
                    user.getBirth().toString(),
                    user.getEmail(),
                    favors.stream()
                            .map(FavorDto::new)
                            .toList()
            );
        }

        public record FavorDto(
                Favor favor
        ) { }
    }

}
