package net.chatfoodie.server.emailVerification;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Entity
@Getter
@DynamicInsert
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "email_verification_tb")
public class EmailVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String email;

    @Column(length = 10, nullable = false)
    private String verificationCode;

    @ColumnDefault("now()")
    private LocalDateTime createdAt;

    @Builder
    public EmailVerification(Long id, String email, String verificationCode, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.verificationCode = verificationCode;
        this.createdAt = createdAt;
    }
}
