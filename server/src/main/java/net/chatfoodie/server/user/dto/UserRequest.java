package net.chatfoodie.server.user.dto;

import net.chatfoodie.server.user.User;

import java.time.LocalDate;

public class UserRequest {
    public record LoginDto(
       String loginId,
       String password
    ) {}

    public record JoinDto(
       String loginId,
       String password,
       String name,
       Boolean gender,
       LocalDate birth,
       String email
    ){
        public User createUser(String EncodedPassword) {
            return User.builder()
                    .loginId(loginId)
                    .password(EncodedPassword)
                    .name(name)
                    .gender(gender)
                    .birth(birth)
                    .build();
        }
    }
}
