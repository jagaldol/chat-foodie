package net.chatfoodie.server.emailVerification.repository;

import net.chatfoodie.server.emailVerification.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByEmail(String email);
    Long countByEmailAndCreatedAtBetween(String email, LocalDateTime start, LocalDateTime end);

    Optional<EmailVerification> findFirstByEmailOrderByCreatedAtDesc(String email);
}
