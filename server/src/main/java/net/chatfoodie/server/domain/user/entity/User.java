package net.chatfoodie.server.domain.user.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "user_tb")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 40)
    private String loginId;

    @Column(nullable = false)
    private String password;

    @ColumnDefault("'회원'")
    private String name;

    @ColumnDefault("0")
    private Boolean gender;

    @ColumnDefault("2000-01-01")
    private LocalDate birth;


    private String email;

    @ColumnDefault("now()")
    private LocalDateTime created_at;

    @Builder
    public User(Long id, String loginId, String password, String name, Boolean gender, LocalDate birth, String email, LocalDateTime created_at) {
        this.id = id;
        this.loginId = Objects.requireNonNull(loginId);
        this.password = Objects.requireNonNull(password);
        this.name = name == null ? "회원" : name;
        this.gender = gender == null ? false : gender;
        this.birth = birth == null ? LocalDate.now() : birth;
        this.email = email == null ? "" : email;
        this.created_at = created_at == null ? LocalDateTime.now() : created_at;
    }
}
