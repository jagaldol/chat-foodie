package net.chatfoodie.server.domain.user.dto;

public class UserRequest {
    public  static record LoginDto(
       String loginId,
       String password
    ) {
    }
}
