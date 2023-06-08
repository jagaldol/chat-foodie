package net.chatfoodie.server.domain.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue
    private Long id;

    private String login_id;

    private String password;

    private String name;

    private Boolean gender;

    private LocalDate birth;

    private String email;

    private LocalDateTime created_at;

    @Builder
    public User(Long id, String login_id, String password, String name, Boolean gender, LocalDate birth, String email, LocalDateTime created_at) {
        this.id = id;
        this.login_id = Objects.requireNonNull(login_id);
        this.password = Objects.requireNonNull(password);
        this.name = name == null ? "회원" : name;
        this.gender = gender == null ? false : gender;
        this.birth = birth == null ? LocalDate.now() : birth;
        this.email = email == null ? "" : email;
        this.created_at = created_at == null ? LocalDateTime.now() : created_at;
    }
}
