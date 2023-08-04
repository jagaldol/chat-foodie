package net.chatfoodie.server.emailVerification.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception400;
import net.chatfoodie.server._core.errors.exception.Exception500;
import net.chatfoodie.server.emailVerification.dto.EmailVerificationRequest;
import net.chatfoodie.server.emailVerification.repository.EmailVerificationRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class EmailVerificationService {
    final private EmailVerificationRepository emailVerificationRepository;

    final private JavaMailSender javaMailSender;
    @Transactional
    public void sendVerificationCode(EmailVerificationRequest.VerificationDto requestDto) {

        var existEmailCnt = emailVerificationRepository.countByEmailAndCreatedAtBetween(requestDto.email(), LocalDate.now().atStartOfDay(), LocalDateTime.now());
        if (existEmailCnt < 5) {
            var verificationCode = makeCode();
            var emailVerification = requestDto.createVerification(verificationCode);

            sendEmail(requestDto.email(), verificationCode);
            try {
                emailVerificationRepository.save(emailVerification);
            } catch (Exception e) {
                throw new Exception500("회원가입 중에 오류가 발생했습니다. 다시 시도해주세요.");
            }
        }
        else {
            throw new Exception400("이메일 인증번호 전송 한도를 초과하였습니다.");
        }
    }

    public String makeCode() {
        Random random = new Random();
        return String.valueOf(random.nextInt(888888) + 111111);
    }

    public void sendEmail(String email, String code) {
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
            throw new Exception500("메일 전송이 한도 초과되었습니다. 내일 다시 시도해주세요.");
        }
    }
}
