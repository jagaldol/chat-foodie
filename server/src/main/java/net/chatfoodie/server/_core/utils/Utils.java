package net.chatfoodie.server._core.utils;

import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception500;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Slf4j
public class Utils {

    public static LocalDate convertStringToDate(String dateString) {
        try {
            // 날짜 형식을 지정합니다. "yyyy-MM-dd"는 "0000-00-00" 형식과 일치합니다.
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            // 날짜 문자열을 LocalDate로 변환합니다.
            return LocalDate.parse(dateString, formatter);
        } catch (DateTimeParseException e) {
            // 날짜 문자열이 올바른 형식이 아닐 경우 예외를 처리합니다.
            // 예를 들어, 유효하지 않은 날짜 형식이나 존재하지 않는 날짜를 변환하려고 하면 이 예외가 발생합니다.
            throw new Exception500("날짜 변환 중 오류가 발생했습니다.");
        }
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
}
