package net.chatfoodie.server.emailVerification.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import net.chatfoodie.server.emailVerification.EmailVerification;

public class EmailVerificationRequest {
    public record VerificationDto(
            @NotEmpty @Size(max = 100, message = "최대 100자까지 입니다.")
            @Pattern(regexp = "^[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,}$", message = "이메일 형식이 아닙니다.")
            String email
    ) {
        public EmailVerification createVerification(String verificationCode) {
            return EmailVerification.builder()
                    .email(email)
                    .verificationCode(verificationCode)
                    .build();
        }
    }
}
