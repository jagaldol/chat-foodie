package net.chatfoodie.server.user;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@DynamicInsert
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_tb")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 40, nullable = false, unique = true)
    private String loginId;

    @Column(length = 100, nullable = false)
    private String password;

    @Column(length = 40) @ColumnDefault("'회원'")
    private String name;

    @ColumnDefault("false")
    private Boolean gender;

    @ColumnDefault("'2000-01-01'")
    private LocalDate birth;

    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @ColumnDefault("now()")
    private LocalDateTime created_at;

    @Builder
    public User(Long id, String loginId, String password, String name, Boolean gender, LocalDate birth, String email, LocalDateTime created_at) {
        this.id = id;
        this.loginId = loginId;
        this.password = password;
        this.name = name;
        this.gender = gender;
        this.birth = birth;
        this.email = email;
        this.created_at = created_at;
    }
}
