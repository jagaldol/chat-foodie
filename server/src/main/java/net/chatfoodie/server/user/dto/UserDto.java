package net.chatfoodie.server.user.dto;

import java.time.LocalDate;

public record UserDto(
        Long id,
        String loginId,
        String name,
        Boolean gender,
        LocalDate birth,
        String email
) {
}
