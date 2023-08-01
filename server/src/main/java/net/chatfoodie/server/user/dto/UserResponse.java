package net.chatfoodie.server.user.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import net.chatfoodie.server._core.utils.Utils;
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
