package net.chatfoodie.server.emailVerification.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception400;
import net.chatfoodie.server._core.errors.exception.Exception404;
import net.chatfoodie.server._core.errors.exception.Exception500;
import net.chatfoodie.server.emailVerification.dto.EmailVerificationRequest;
import net.chatfoodie.server.emailVerification.repository.EmailVerificationRepository;
import net.chatfoodie.server.user.Role;
import net.chatfoodie.server.user.repository.UserRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
    public void sendVerificationCode(EmailVerificationRequest.VerificationDto requestDto) {

        var existEmailCnt = emailVerificationRepository.countByEmailAndCreatedAtBetween(requestDto.email(), LocalDate.now().atStartOfDay(), LocalDateTime.now());

        if (existEmailCnt >= 5) throw new Exception400("하루 최대 5번까지 인증번호 메일을 요청할 수 있습니다.");

        if (userRepository.findByEmail(requestDto.email()).isPresent()) {
            throw new Exception400("이미 존재하는 이메일입니다.");
        }

        var verificationCode = makeCode();
        var emailVerification = requestDto.createVerification(verificationCode);

        sendEmail(requestDto.email(), verificationCode);

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
        String subject = "chatfoodie 회원가입 인증번호입니다.";
        String text = "회원가입을 위한 인증번호는 " + code + "입니다. </br>";

        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(text, true);
            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            throw new Exception500("서버 이메일 전송 한도가 초과되었습니다. 내일 다시 시도해주세요.");
        }
    }

    @Transactional
    public void verifyVerificationCode(EmailVerificationRequest.VerificationCodeDto requestDto) {
        var emailVerification = emailVerificationRepository.findFirstByEmailOrderByCreatedAtDesc(requestDto.email())
                .orElseThrow(() -> new Exception404("존재하지 않은 이메일 입니다."));

        if (!Objects.equals(emailVerification.getVerificationCode(), requestDto.verificationCode())) {
            throw new Exception400("인증코드가 일치하지 않습니다.");
        }

        var user = userRepository.findByEmail(requestDto.email())
                .orElseThrow(() -> new Exception404("현재 이메일의 유저를 찾을 수 없습니다."));
        user.updateRole(Role.ROLE_USER);
    }
}
