package net.chatfoodie.server.user.dto;

import net.chatfoodie.server.user.User;

public class UserResponse {
    public record getUserDto(
        Long id,
        String loginId,
        String name,
        Boolean gender,
        String birth,
        String email
    ){
        public getUserDto(User user) {
            this(user.getId(), user.getLoginId(), user.getName(), user.getGender(), user.getBirth().toString(), user.getEmail());
        }
    }

}
