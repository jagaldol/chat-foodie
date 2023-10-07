package net.chatfoodie.server.emailVerification.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception400;
import net.chatfoodie.server._core.errors.exception.Exception404;
import net.chatfoodie.server._core.errors.exception.Exception500;
import net.chatfoodie.server._core.security.JwtProvider;
import net.chatfoodie.server._core.utils.Utils;
import net.chatfoodie.server.emailVerification.EmailVerification;
import net.chatfoodie.server.emailVerification.dto.EmailVerificationRequest;
import net.chatfoodie.server.emailVerification.repository.EmailVerificationRepository;
import net.chatfoodie.server.user.Role;
import net.chatfoodie.server.user.User;
import net.chatfoodie.server.user.repository.UserRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Random;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class EmailVerificationService {
    final private EmailVerificationRepository emailVerificationRepository;

    final private UserRepository userRepository;

    final private JavaMailSender javaMailSender;
    @Transactional
    public void sendVerificationCode(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new Exception404("유저를 찾을 수 없습니다."));
        var email = user.getEmail();

        var existEmailCnt = emailVerificationRepository.countByEmailAndCreatedAtBetween(email, LocalDate.now().atStartOfDay(), LocalDateTime.now());

        if (existEmailCnt >= 5) throw new Exception400("하루 최대 5번까지 인증번호 메일을 요청할 수 있습니다.");

        var verificationCode = makeCode();
        var emailVerification = EmailVerification.builder()
                                                .email(email)
                                                .verificationCode(verificationCode)
                                                .build();

        sendEmail(email, verificationCode);

        try {
            emailVerificationRepository.save(emailVerification);
        } catch (Exception e) {
            throw new Exception500("인증 번호 생성 중 오류가 발생했습니다.");
        }
    }

    private String makeCode() {
        Random random = new Random();
        return String.valueOf(random.nextInt(888888) + 111111);
    }

    private void sendEmail(String email, String code) {
        String subject = "chatfoodie 이메일 인증번호입니다.";
        String text = "이메일 인증을 위한 인증번호는 " + code + "입니다. </br>";

        Utils.sendEmail(javaMailSender, email, subject, text);
    }

    @Transactional
    public String verifyVerificationCode(Long userId, EmailVerificationRequest.VerificationCodeDto requestDto) {
        User user = userRepository.findById(userId).orElseThrow(() -> new Exception404("유저를 찾을 수 없습니다."));
        var email = user.getEmail();

        var emailVerification = emailVerificationRepository.findFirstByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new Exception404("존재하지 않은 이메일 입니다."));

        if (!Objects.equals(emailVerification.getVerificationCode(), requestDto.verificationCode())) {
            throw new Exception400("인증코드가 일치하지 않습니다.");
        }

        user.updateRole(Role.ROLE_USER);
        return JwtProvider.create(user);
    }
}
