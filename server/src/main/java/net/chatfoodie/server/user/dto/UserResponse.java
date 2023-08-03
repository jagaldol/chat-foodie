package net.chatfoodie.server.user.dto;

import net.chatfoodie.server.favor.Favor;
import net.chatfoodie.server.user.User;

import java.util.List;

public class UserResponse {
    public record GetUserDto(
        Long id,
        String loginId,
        String name,
        Boolean gender,
        String birth,
        String email,
        List<FavorDto> favors
    ){
        public GetUserDto(User user, List<Favor> favors) {
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
                Long id,
                String foodName
        ) {
            public FavorDto(Favor favor) {
                this(favor.getId(), favor.getFood().getName());
            }
        }
    }

}
