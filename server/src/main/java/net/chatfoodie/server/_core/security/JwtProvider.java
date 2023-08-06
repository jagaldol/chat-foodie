package net.chatfoodie.server._core.security;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import net.chatfoodie.server.user.User;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class JwtProvider {
    public static final Long EXP = 1000L * 60 * 60 * 48; // 토큰 유효기간 - 테스트 용 48시간
    public static final String TOKEN_PREFIX = "Bearer "; // 스페이스 필요함
    public static final String HEADER = "Authorization";
    public static final String SECRET = "chatFoodie"; // JWT 암호화 핵심 비밀키 배포 전 바꾸고 숨겨야함

    public static String create(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expired = now.plusDays(2);  // 사실 지금 EXP 안쓰고 이걸로 돼있음
        String jwt = JWT.create()
                .withExpiresAt(Timestamp.valueOf(expired))
                .withClaim("id", user.getId())
                .sign(Algorithm.HMAC512(SECRET));
        return TOKEN_PREFIX + jwt;
    }

    public static DecodedJWT verify(String jwt) {
        return JWT.require(Algorithm.HMAC512(SECRET)).build()
                .verify(jwt.replace(TOKEN_PREFIX, ""));
    }
}
