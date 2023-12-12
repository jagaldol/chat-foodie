package net.chatfoodie.server._core.security;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import net.chatfoodie.server.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Component
public class JwtProvider {
    public static final int ACCESS_EXP_SEC = 60 * 5;
    public static final int REFRESH_EXP_SEC = 60 * 60 * 24 * 30;
    public static final String TOKEN_PREFIX = "Bearer "; // 스페이스 필요함
    public static final String HEADER = "Authorization";
    private static String secret;

    @Value("${chat-foodie.secret}")
    public void setKey(String value) {
        secret = value;
    }

    public static String createAccess(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expired = now.plusSeconds(ACCESS_EXP_SEC);  // 지금 EXP 안쓰고 이걸로 돼있음
        String jwt = JWT.create()
                .withExpiresAt(Timestamp.valueOf(expired))
                .withClaim("id", user.getId())
                .withClaim("role", String.valueOf(user.getRole()))
                .sign(Algorithm.HMAC512(secret));
        return TOKEN_PREFIX + jwt;
    }


    public static String createRefresh(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expired = now.plusSeconds(REFRESH_EXP_SEC);  // 지금 EXP 안쓰고 이걸로 돼있음
        return JWT.create()
                .withExpiresAt(Timestamp.valueOf(expired))
                .withClaim("id", user.getId())
                .sign(Algorithm.HMAC512(secret));
    }

    public static DecodedJWT verify(String jwt) {
        return JWT.require(Algorithm.HMAC512(secret)).build()
                .verify(jwt.replace(TOKEN_PREFIX, ""));
    }
}
