package net.chatfoodie.server._core.utils;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.config.MailConfig;
import net.chatfoodie.server._core.errors.exception.Exception500;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Slf4j
public class Utils {

    public static LocalDate convertStringToDate(String dateString) {
        try {
            List<Integer> birthSplit = Arrays.stream(dateString.split("-"))
                    .map(Integer::parseInt)
                    .toList();

            return LocalDate.of(birthSplit.get(0), birthSplit.get(1), birthSplit.get(2));

        } catch (DateTimeParseException e) {
            // 날짜 문자열이 올바른 형식이 아닐 경우 예외를 처리합니다.
            // 예를 들어, 유효하지 않은 날짜 형식이나 존재하지 않는 날짜를 변환하려고 하면 이 예외가 발생합니다.
            throw new Exception500("날짜 변환 중 오류가 발생했습니다.");
        }
    }

    public static String convertDateTimeToString(LocalDateTime localDateTime) {
        return localDateTime.format(DateTimeFormatter.ofPattern("MM.dd a hh:mm"));
    }

    public static boolean validateDayOfDateString(int year, int month, int day) {
        List<Integer> dayByMonth = List.of(31, 28, 31, 30, 31, 30, 31, 31, 30 ,31, 30, 31);

        int dayOfLeapYear = 29;

        boolean isLeap = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);

        if (month == 2 && isLeap) {
            return day <= dayOfLeapYear;
        }
        return day <= dayByMonth.get(month - 1);
    }

    public static String generateRandomPassword() {
        Random random = new Random();

        String PASSWORD_ALLOW_BASE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&";
        Integer PASSWORD_LENGTH = 16;

        String password = "";

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int rndCharAt = random.nextInt(PASSWORD_ALLOW_BASE.length());
            char rndChar = PASSWORD_ALLOW_BASE.charAt(rndCharAt);
            password += rndChar;
        }

        return password;
    }

    public static void sendEmail(JavaMailSender javaMailSender, String to, String subject, String text) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true);
            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            StackTraceElement[] err = e.getStackTrace();
            for (StackTraceElement stackTraceElement: err
                 ) {
                log.error(stackTraceElement.toString());
            }
            throw new Exception500("서버 이메일 전송 한도가 초과되었습니다. 내일 다시 시도해주세요.");
        }
    }
}
