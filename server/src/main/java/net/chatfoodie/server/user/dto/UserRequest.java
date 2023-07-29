package net.chatfoodie.server.user.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import net.chatfoodie.server.user.User;

public class UserRequest {
    public record LoginDto(
       String loginId,
       String password
    ) {}

    public record JoinDto(
       @NotEmpty @Size(min = 8, max = 40, message = "8자에서 40자 이내여야 합니다.")
       @Pattern(regexp = "^[\\w.]+$", message = "영문, 숫자, _, . 만 가능합니다.")
       String loginId,
       @NotEmpty @Size(min = 8, max = 64, message = "8자에서 64자 이내여야 합니다.")
       @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*[\\d@#$%^&!])[a-zA-Z\\d@#$%^&!]{8,}$", message = "영문, 숫자, 특수문자 중 최소 2종류를 포함해야 합니다.")
       String password,
       @NotEmpty
       String passwordCheck,
       @Size(max = 40, message = "최대 40자까지 입니다.")
       String name,
       Boolean gender,
       @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "0000-00-00 형식이 아닙니다.")
       String birth,
       @NotEmpty @Size(max = 100, message = "최대 100자까지 입니다.")
       @Pattern(regexp = "^[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,}$", message = "이메일 형식이 아닙니다.")
       String email
    ){
        public User createUser(String EncodedPassword) {
            return User.builder()
                    .loginId(loginId)
                    .password(EncodedPassword)
                    .name(name)
                    .gender(gender)
//                    .birth(birth)
                    .email(email)
                    .build();
        }
    }
}
