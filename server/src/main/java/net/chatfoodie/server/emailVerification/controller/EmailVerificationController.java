package net.chatfoodie.server.emailVerification.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.security.CustomUserDetails;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server.emailVerification.dto.EmailVerificationRequest;
import net.chatfoodie.server.emailVerification.service.EmailVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class EmailVerificationController {
    final private EmailVerificationService emailVerificationService;

    @PostMapping("/email-verifications")
    public ResponseEntity<?> sendVerificationCode(@AuthenticationPrincipal CustomUserDetails userDetails) {
        emailVerificationService.sendVerificationCode(userDetails.getId());
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/email-verifications/confirm")
    public ResponseEntity<?> verifyVerificationCode(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                    @RequestBody @Valid EmailVerificationRequest.VerificationCodeDto requestDto,
                                                    Errors errors) {
        emailVerificationService.verifyVerificationCode(userDetails.getId(), requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().body(response);
    }
}
