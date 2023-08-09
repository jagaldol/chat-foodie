package net.chatfoodie.server.chat.publiclog.repository;

import net.chatfoodie.server.chat.publiclog.ChatPublicLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ChatPublicLogRepository extends JpaRepository<ChatPublicLog, Long> {

    Long countByIpAndCreatedAtBetween(String ip, LocalDateTime start, LocalDateTime end);

}
