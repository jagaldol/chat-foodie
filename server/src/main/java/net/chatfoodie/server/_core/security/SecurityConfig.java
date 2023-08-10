package net.chatfoodie.server._core.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import net.chatfoodie.server._core.config.Configs;
import net.chatfoodie.server._core.errors.exception.Exception401;
import net.chatfoodie.server._core.errors.exception.Exception403;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // 1. CSRF 해제
        // SSR으로 스프링이 직접 페이지 만들어서 줄때는 csrf를 붙이는게 좋지만 프론트가 분리되어 있다면 그냥 해제하는게 낫다.
        // Postman 에서 테스트할때도 csrf.disable 을 하지 않으면 에러가 발생한다.
        http.csrf(AbstractHttpConfigurer::disable); // postman 접근해야 함!! - CSR 할때!!

        // 2. iframe 거부
        http.headers(headers ->
                headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));

        // 3. cors 재설정
        http.cors(cors ->
                cors.configurationSource(configurationSource()));

        // 4. jSessionId 가 응답이 될 때 세션영역에서 사라진다(JWT 로 stateless 하게 할거임)
        http.sessionManagement(management ->
                management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 5. form 로그인 해제해서 UsernamePasswordAuthenticationFilter 비활성화 시키기 (Form Post x-www-form-urlencoded)
        http.formLogin(AbstractHttpConfigurer::disable);

        // 6. 로그인 인증창이 뜨지 않도록 HttpBasicAuthenticationFilter 비활성화 (헤더에 username, password)
        http.httpBasic(AbstractHttpConfigurer::disable);

        // 7. 커스텀 필터들 적용 - 시큐리티 필터 커스텀으로 교체 (필터들을 갈아끼우는 내부 클래스)
        http.apply(new CustomSecurityFilterManager());

        // 8. 인증 실패 처리
        http.exceptionHandling(handling ->
                handling.authenticationEntryPoint(((request, response, authException) -> {
                    var e = new Exception401("인증되지 않았습니다.");
                    response.setStatus(e.status().value());
                    response.setContentType("application/json; charset=utf-8");
                    ObjectMapper om = new ObjectMapper();
                    String responseBody = om.writeValueAsString(e.body());
                    response.getWriter().println(responseBody);
                })));

        // 9. 권한 실패 처리
        http.exceptionHandling(handling ->
                handling.accessDeniedHandler(((request, response, accessDeniedException) -> {
                    var e = new Exception403("권한이 없습니다");
                    response.setStatus(e.status().value());
                    response.setContentType("application/json; charset=utf-8");
                    ObjectMapper om = new ObjectMapper();
                    String responseBody = om.writeValueAsString(e.body());
                    response.getWriter().println(responseBody);
                })));

        // 10. 인증, 권한 필터 설정
        http.authorizeHttpRequests(authorize ->
                        authorize.requestMatchers("/api/chatrooms/**", "/api/users/**", "api/chat").hasRole("USER")
                                .requestMatchers("/api/email-verifications/**").hasAnyRole("PENDING", "USER")
                                .anyRequest().permitAll()
        );

        return http.build();
    }

    public CorsConfigurationSource configurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*"); // GET, POST, PUT, DELETE (Javascript 요청 허용)
        configuration.setAllowedOrigins(Configs.CORS);
        configuration.setAllowCredentials(true); // 클라이언트에서 쿠키 요청 허용
        configuration.addExposedHeader("Authorization"); // 헤더로 Authorization
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
