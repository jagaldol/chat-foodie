package net.chatfoodie.server._core.security;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Component
public class JwtProvider {
    public static final Long EXP = 1000L * 60 * 60 * 48; // 토큰 유효기간 - 사실 안쓰임
    public static final String TOKEN_PREFIX = "Bearer "; // 스페이스 필요함
    public static final String HEADER = "Authorization";
    private static String SECRET;

    @Value("${chat-foodie.secret}")
    public void setKey(String value) {
        SECRET = value;
    }

    public static String create(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expired = now.plusDays(1);  // 지금 EXP 안쓰고 이걸로 돼있음
        String jwt = JWT.create()
                .withExpiresAt(Timestamp.valueOf(expired))
                .withClaim("id", user.getId())
                .withClaim("role", String.valueOf(user.getRole()))
                .sign(Algorithm.HMAC512(SECRET));
        return TOKEN_PREFIX + jwt;
    }

    public static DecodedJWT verify(String jwt) {
        return JWT.require(Algorithm.HMAC512(SECRET)).build()
                .verify(jwt.replace(TOKEN_PREFIX, ""));
    }
}
