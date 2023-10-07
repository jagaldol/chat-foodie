package net.chatfoodie.server.emailVerification.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import net.chatfoodie.server.emailVerification.EmailVerification;

public class EmailVerificationRequest {

    public record VerificationCodeDto(
            @NotEmpty @Size(min=6, max=6, message = "6자리 숫자 코드입니다.")
            @Pattern(regexp = "^[1-9][0-9]{5}$", message = "인증 코드 형식이 아닙니다.")
            String verificationCode
    ) { }
}
