package net.chatfoodie.server._core.security;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

public class CustomSecurityFilterManager extends AbstractHttpConfigurer<CustomSecurityFilterManager, HttpSecurity> {
    @Override
    public void configure(HttpSecurity builder) throws Exception {
        super.configure(builder);
    }
}
